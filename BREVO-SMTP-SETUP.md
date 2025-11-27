# 🔧 Brevo SMTP Configuration Guide

This guide explains how to properly configure Brevo (formerly Sendinblue) SMTP credentials for the contact form.

## 📋 Step-by-Step Setup

### 1. Access Brevo SMTP Settings

1. Log in to your [Brevo account](https://app.brevo.com)
2. Go to **Settings** → **SMTP & API**
3. Click on the **SMTP** tab

### 2. Get Your SMTP Credentials

You'll need **two different pieces of information**:

#### A. SMTP Login (Username)
- This is your **full email address** that you used to register with Brevo
- Example: `your-email@example.com`
- ⚠️ **NOT** your Brevo account username or display name

#### B. SMTP Key (Password)
- Click **"Generate a new SMTP key"** or use an existing one
- This is a **specific SMTP password/key**, NOT:
  - ❌ Your Brevo account password
  - ❌ Your API key (different from SMTP key)
  - ❌ Your login password
- ⚠️ Copy this key immediately - you won't be able to see it again!

### 3. SMTP Server Settings

For Brevo, use these settings:

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@example.com  (your full email address)
SMTP_PASS=your-smtp-key-here      (the SMTP key from step 2B)
```

**Alternative ports:**
- Port `587` (recommended) - STARTTLS
- Port `465` - SSL/TLS
- Port `2525` - Alternative STARTTLS

### 4. Environment Variables

Add these to your `.env.local` file:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-smtp-key-here

# Optional: Custom sender name
SMTP_FROM=Stackbyte Contact <your-email@example.com>

# Email address to receive contact form submissions
CONTACT_EMAIL=your-contact@example.com
```

### 5. Common Mistakes to Avoid

❌ **Using API Key instead of SMTP Key**
- API keys are for REST API, not SMTP
- SMTP requires a separate key from the SMTP settings page

❌ **Using account password**
- Your Brevo account password won't work for SMTP
- You must use the SMTP key generated in the SMTP settings

❌ **Wrong email format**
- Use your **full email address**, not just username
- Example: `user@example.com` ✅ not `user` ❌

❌ **Extra spaces or quotes**
- Don't add quotes around values in `.env.local`
- Don't add trailing spaces

### 6. Verify Your Configuration

After setting up, test the connection:

1. Restart your Next.js development server
2. Try submitting the contact form
3. Check the server logs for any SMTP errors

### 7. Troubleshooting

#### Error: "535 5.7.8 Authentication failed"

**Possible causes:**
1. Wrong SMTP key (using API key instead)
2. Wrong email address (not using full email)
3. SMTP key expired or regenerated
4. Extra spaces in environment variables

**Solution:**
1. Go to Brevo → Settings → SMTP & API → SMTP
2. Generate a **new SMTP key**
3. Update `SMTP_PASS` in `.env.local` with the new key
4. Restart your server

#### Error: "Connection timeout"

**Possible causes:**
1. Firewall blocking port 587
2. Wrong SMTP host

**Solution:**
- Try port `2525` instead of `587`
- Verify `SMTP_HOST=smtp-relay.brevo.com` is correct

#### Still having issues?

1. **Double-check credentials:**
   - Log in to Brevo
   - Go to Settings → SMTP & API → SMTP
   - Verify the email address matches `SMTP_USER`
   - Generate a fresh SMTP key and update `SMTP_PASS`

2. **Test with a simple script:**
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     host: 'smtp-relay.brevo.com',
     port: 587,
     secure: false,
     auth: {
       user: 'your-email@example.com',
       pass: 'your-smtp-key',
     },
   });
   
   transporter.verify((error, success) => {
     if (error) {
       console.log('Error:', error);
     } else {
       console.log('Server is ready to send emails');
     }
   });
   ```

3. **Contact Brevo Support:**
   - If credentials are definitely correct
   - Check [Brevo Status Page](https://status.brevo.com) for service issues

## 📚 Additional Resources

- [Brevo SMTP Documentation](https://help.brevo.com/hc/en-us/articles/209467485)
- [Brevo SMTP Troubleshooting](https://help.brevo.com/hc/en-us/articles/115000188150)

