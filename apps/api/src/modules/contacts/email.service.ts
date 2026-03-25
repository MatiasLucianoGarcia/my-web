import { Resend } from 'resend';
import { logger } from '../../config/logger.js';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env['RESEND_API_KEY']) return null;
  if (!resend) resend = new Resend(process.env['RESEND_API_KEY']);
  return resend;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailPayload): Promise<void> {
  const client = getResend();
  if (!client) {
    logger.warn('RESEND_API_KEY not set — skipping email notification');
    return;
  }

  const toEmail = process.env['CONTACT_NOTIFICATION_EMAIL'] ?? process.env['ADMIN_EMAIL'] ?? 'mati.luciano.garcia@gmail.com';
  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'onboarding@resend.dev';

  try {
    await client.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `[Portfolio Contact] ${data.subject}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fafafa; border-radius: 12px;">
          <h2 style="color: #1a1a2e; margin-bottom: 4px;">New contact form submission</h2>
          <p style="color: #888; font-size: 14px; margin-top: 0;">matiasgarcia.dev</p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 12px 16px; font-size: 13px; color: #888; width: 100px; background: #f5f5f5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eee;">From</td>
              <td style="padding: 12px 16px; font-size: 15px; color: #1a1a2e; border-bottom: 1px solid #eee;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 13px; color: #888; background: #f5f5f5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eee;">Email</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}" style="color: #6c63ff; text-decoration: none; font-size: 15px;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 13px; color: #888; background: #f5f5f5; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</td>
              <td style="padding: 12px 16px; font-size: 15px; color: #1a1a2e;">${data.subject}</td>
            </tr>
          </table>

          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px;">
            <p style="font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">Message</p>
            <p style="color: #333; line-height: 1.7; margin: 0; font-size: 15px; white-space: pre-wrap;">${data.message}</p>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${data.email}?subject=Re: ${data.subject}"
               style="display: inline-block; background: #6c63ff; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Reply to ${data.name}
            </a>
          </div>

          <p style="color: #bbb; font-size: 12px; text-align: center; margin-top: 24px;">
            Sent via contact form at matiasgarcia.dev
          </p>
        </div>
      `,
    });

    logger.info({ to: toEmail, from: data.email }, '📧 Contact notification email sent');
  } catch (err) {
    logger.error({ err }, '❌ Failed to send contact notification email');
    // Don't throw — the contact was saved to DB, email is best-effort
  }
}
