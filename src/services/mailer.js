import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const configured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const transporter = configured
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
      disableFileAccess: true,
      disableUrlAccess: true,
    })
  : null;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shell(title, body) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#20242c;max-width:640px;margin:auto">
      <h1 style="font-size:24px">${escapeHtml(title)}</h1>
      <div>${body}</div>
      <p style="color:#667085;font-size:13px;margin-top:28px">FreelanceHub sends this notification for important account, order, and payment updates.</p>
    </div>
  `;
}

export async function sendEmail({ to, subject, html, text }) {
  if (!configured) {
    console.warn(`[mail skipped] ${subject} -> ${to}`);
    return { skipped: true };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  });
}

export async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to FreelanceHub",
    html: shell(
      "Welcome to FreelanceHub",
      `<p>Hi ${escapeHtml(user.name)}, your account is ready. You can now hire talent, sell services, and use protected milestone payments.</p>`,
    ),
    text: `Hi ${user.name}, your FreelanceHub account is ready.`,
  });
}

export async function sendLoginEmail(user) {
  return sendEmail({
    to: user.email,
    subject: "New FreelanceHub login",
    html: shell(
      "New login detected",
      `<p>Hi ${escapeHtml(user.name)}, your FreelanceHub account was just used to sign in.</p><p>If this was not you, reset your password immediately.</p>`,
    ),
    text: `Hi ${user.name}, your FreelanceHub account was just used to sign in.`,
  });
}

export async function sendOrderEmail({ user, subject, title, message }) {
  return sendEmail({
    to: user.email,
    subject,
    html: shell(title, `<p>${escapeHtml(message)}</p>`),
    text: message,
  });
}

export function isMailerConfigured() {
  return configured;
}
