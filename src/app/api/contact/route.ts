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

    // Send Email via Brevo SMTP
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `Stackbyte Contact <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `New Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } else {
      console.log('Email sending skipped (no credentials). Data:', { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

