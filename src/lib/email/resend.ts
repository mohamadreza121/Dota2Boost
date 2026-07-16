import "server-only";
import { Resend } from "resend";

export async function sendApplicationReceipt({ to, displayName, applicationId }: { to: string; displayName: string; applicationId: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { skipped: true as const };
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "We received your Highground booster application",
    html: `<div style="background:#0b0d0d;color:#f2f0e9;padding:36px;font-family:Arial,sans-serif"><div style="max-width:560px;margin:auto"><p style="color:#d3a85c;font-size:12px;letter-spacing:2px;text-transform:uppercase">Application received</p><h1 style="font-size:28px;margin:16px 0">Thanks, ${escapeHtml(displayName)}.</h1><p style="color:#a9b0ad;line-height:1.7">Our team will review your rank history, conduct, communication, and sample queue plan. If we need evidence or an interview, we will contact you from an official Highground address.</p><p style="color:#a9b0ad;line-height:1.7">Reference: <strong style="color:#f2f0e9">${escapeHtml(applicationId)}</strong></p><div style="border-top:1px solid #292e2e;margin-top:28px;padding-top:20px;color:#727a77;font-size:12px">Never send Steam passwords, login codes, recovery codes, or remote-access details in response to any application request.</div></div></div>`
  });
  if (error) throw new Error("Application email could not be sent.");
  return { skipped: false as const };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
