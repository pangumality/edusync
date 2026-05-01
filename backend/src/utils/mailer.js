import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  const missing = [];
  if (!host) missing.push('SMTP_HOST');
  if (!port) missing.push('SMTP_PORT');
  if (!user) missing.push('SMTP_USER');
  if (!pass) missing.push('SMTP_PASS');

  if (missing.length > 0) return { transporter: null, missing };

  return {
    transporter: nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    }),
    missing: [],
  };
};

export const sendEmail = async ({ to, subject, text, replyTo }) => {
  const { transporter, missing } = getTransporter();
  if (!transporter) {
    const err = new Error(
      missing?.length ? `Email sending is not configured (missing: ${missing.join(', ')})` : 'Email sending is not configured'
    );
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    replyTo,
  });

  return { messageId: info?.messageId || null };
};
