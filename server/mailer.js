import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

// Initialize mailer
export async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test account or use simulated transport for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('✉️ Dev Mailer initialized with Ethereal Test Account:', testAccount.user);
    } catch (e) {
      // Fallback simulated transport
      transporter = {
        sendMail: async (opts) => {
          console.log(`✉️ [SIMULATED EMAIL SENT] To: ${opts.to} | Subject: ${opts.subject}`);
          return { messageId: `mock-${Date.now()}` };
        }
      };
    }
  }
  return transporter;
}

export async function sendEmail({ to, subject, body, template }) {
  try {
    const mail = await getTransporter();
    const info = await mail.sendMail({
      from: '"UniSphere System" <noreply@unisphere.ac.za>',
      to,
      subject,
      text: body,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="background-color: #0f1f3d; padding: 16px; border-radius: 6px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">UniSphere</h2>
            <p style="color: #d4a843; margin: 4px 0 0; font-size: 13px; letter-spacing: 1px;">UNIVERSITY MANAGEMENT & STUDENT SUCCESS</p>
          </div>
          <div style="padding: 24px 8px; color: #1e293b; line-height: 1.6;">
            <h3 style="color: #0f1f3d;">${subject}</h3>
            <p style="white-space: pre-wrap;">${body}</p>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
            This is an automated notification from UniSphere · Do not reply directly to this email.
          </div>
        </div>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}

