const nodemailer = require("nodemailer");

let transporter;

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM
  );

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!isEmailConfigured()) {
    throw new Error("Email service is not configured. Please set SMTP and EMAIL_FROM environment variables.");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const activeTransporter = getTransporter();

  return activeTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

module.exports = {
  isEmailConfigured,
  sendEmail,
};
