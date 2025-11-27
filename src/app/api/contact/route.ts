import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Captcha token missing' }, { status: 400 });
    }

    // Verify Turnstile Token
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await axios.post(verifyUrl, {
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    });

    if (!result.data.success) {
      return NextResponse.json({ error: 'Captcha validation failed' }, { status: 400 });
    }

    // Send Email via SMTP (Brevo/Gmail/etc.)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      if (!process.env.SMTP_PASS) {
        console.error('SMTP_PASS is missing in environment variables');
        return NextResponse.json(
          { error: 'Email service not properly configured' },
          { status: 500 }
        );
      }

      // Brevo-specific configuration
      const isBrevo = process.env.SMTP_HOST.includes('brevo.com') ||
        process.env.SMTP_HOST.includes('sendinblue.com');

      const smtpPort = Number(process.env.SMTP_PORT) || 587;
      const isSecurePort = smtpPort === 465;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: isSecurePort, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER.trim(), // Remove any whitespace
          pass: process.env.SMTP_PASS.trim(), // Remove any whitespace
        },
        // Brevo-specific TLS configuration
        ...(isBrevo && {
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
          },
          requireTLS: !isSecurePort, // Require TLS for port 587
        }),
        // General TLS options for other providers
        ...(!isBrevo && {
          tls: {
            rejectUnauthorized: false,
          },
        }),
      });

      // Log configuration (without sensitive data)
      if (process.env.NODE_ENV === 'development') {
        console.log('SMTP Configuration:', {
          host: process.env.SMTP_HOST,
          port: smtpPort,
          secure: isSecurePort,
          user: process.env.SMTP_USER,
          passLength: process.env.SMTP_PASS?.length,
          isBrevo,
        });
      }

      // Verify connection configuration
      try {
        await transporter.verify();
        if (process.env.NODE_ENV === 'development') {
          console.log('SMTP connection verified successfully');
        }
      } catch (verifyError: unknown) {
        const error = verifyError as { code?: string; message?: string; response?: string; responseCode?: number };
        console.error('SMTP connection verification failed:', {
          code: error.code,
          message: error.message,
          response: error.response,
          responseCode: error.responseCode,
        });

        // More specific error message for Brevo
        if (isBrevo && error.code === 'EAUTH') {
          return NextResponse.json(
            {
              error: 'Brevo SMTP authentication failed.',
              details: 'Please verify: 1) SMTP_USER is your full email address, 2) SMTP_PASS is your SMTP key (not API key), 3) Credentials are from Brevo SMTP settings page'
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { error: 'Email service authentication failed. Please check your SMTP credentials.' },
          { status: 500 }
        );
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `Stackbyte Contact <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `New Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } else {
      console.log('Email sending skipped (no credentials). Data:', { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact error:', error);
    const err = error as { code?: string; message?: string };

    // Provide more specific error messages
    if (err.code === 'EAUTH') {
      return NextResponse.json(
        {
          error: 'Email authentication failed. Please check your SMTP credentials in environment variables.',
          details: 'Invalid SMTP username or password'
        },
        { status: 500 }
      );
    }

    if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      return NextResponse.json(
        {
          error: 'Could not connect to email server. Please check your SMTP host and port settings.',
          details: err.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to send email. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
}

