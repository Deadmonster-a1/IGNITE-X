import nodemailer from "nodemailer"
import { getSiteUrl } from "@/lib/utils"
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

const BASE_STYLES = `
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Courier New', monospace; }
    .wrapper { background: #0a0a0a; padding: 40px 20px; }
    .card { background: #111; border: 1px solid #f26722; max-width: 480px; margin: 0 auto; }
    .accent-bar { background: linear-gradient(90deg, transparent, #f26722, transparent); height: 3px; }
    .logo-area { padding: 32px 40px 0; text-align: center; }
    .logo { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: 4px; }
    .logo-sub { color: #666; font-size: 10px; letter-spacing: 6px; margin: 4px 0 0; text-transform: uppercase; }
    .body { padding: 32px 40px; }
    h2 { color: #f26722; font-size: 18px; font-weight: 700; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 2px; }
    p { color: #aaa; font-size: 14px; line-height: 1.7; margin: 0 0 16px; }
    .info-box { background: #0d0d0d; border: 1px solid #1e1e1e; padding: 14px 18px; margin-bottom: 20px; font-size: 12px; }
    .info-row { margin: 0 0 6px; }
    .label { color: #555; }
    .value { color: #aaa; }
    .warn-box { background: #0d0d0d; border-left: 3px solid #f26722; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: #666; }
    .footer-accent { background: linear-gradient(90deg, transparent, #f26722, transparent); height: 1px; }
    .footer { padding: 16px 40px; text-align: center; }
    .footer p { color: #333; font-size: 10px; letter-spacing: 3px; margin: 0; }
    .divider { border-top: 1px solid #222; padding-top: 20px; margin-top: 4px; }
    .small { color: #444; font-size: 11px; }
  </style>
`

function wrapEmail(subtitle: string, heading: string, content: string): string {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${BASE_STYLES}</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="accent-bar"></div>
    <div class="logo-area">
      <div class="logo">ASCI</div>
      <div class="logo-sub">${subtitle}</div>
    </div>
    <div class="body">
      <h2>${heading}</h2>
      ${content}
      <div class="divider">
        <p class="small">This is an automated security notification from ASCI. Do not reply to this email.</p>
      </div>
    </div>
    <div class="footer-accent"></div>
    <div class="footer"><p>ASCI · CLASSIFIED COMMS</p></div>
  </div>
</div>
</body></html>`
}

export type MailPayload = {
    to: string
    subject: string
    html: string
}

export async function sendMail(payload: MailPayload) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("[mailer] SMTP_USER or SMTP_PASS not set — skipping email.")
        return
    }
    try {
        await transporter.sendMail({
            from: `"ASCI" <${process.env.SMTP_USER}>`,
            ...payload,
        })
    } catch (err) {
        console.error("[mailer] Failed to send email:", err)
    }
}

// ─── Templates ───────────────────────────────────────────────

export function loginAlertEmail(opts: {
    email: string
    time: string
    ip?: string
    device?: string
}): MailPayload {
    return {
        to: opts.email,
        subject: "[ASCI] New Login Detected",
        html: wrapEmail("Security Alert", "New Login Detected", `
      <p>A new sign-in was detected for your ASCI account. If this was you, no action is needed.</p>
      <div class="info-box">
        <div class="info-row"><span class="label">EMAIL: </span><span class="value">${opts.email}</span></div>
        <div class="info-row"><span class="label">TIME:  </span><span class="value">${opts.time}</span></div>
        ${opts.ip ? `<div class="info-row"><span class="label">IP:    </span><span class="value">${opts.ip}</span></div>` : ""}
        ${opts.device ? `<div class="info-row"><span class="label">AGENT: </span><span class="value">${opts.device}</span></div>` : ""}
      </div>
      <div class="warn-box">
        <strong style="color:#f26722;">⚠ Wasn't you?</strong><br>
        Reset your password immediately at <a href="${getSiteUrl()}/forgot-password" style="color:#f26722;">${getSiteUrl()}/forgot-password</a>
      </div>
    `),
    }
}

export function passwordChangedEmail(opts: { email: string; time: string }): MailPayload {
    return {
        to: opts.email,
        subject: "[ASCI] Your Password Was Changed",
        html: wrapEmail("Account Security", "Password Changed", `
      <p>Your <strong style="color:#fff;">ASCI</strong> account password was successfully updated.</p>
      <div class="info-box">
        <div class="info-row"><span class="label">ACCOUNT: </span><span class="value">${opts.email}</span></div>
        <div class="info-row"><span class="label">TIME:    </span><span class="value">${opts.time}</span></div>
      </div>
      <div class="warn-box">
        <strong style="color:#f26722;">⚠ Wasn't you?</strong><br>
        Contact support immediately or try to regain access at 
        <a href="${getSiteUrl()}/forgot-password" style="color:#f26722;">forgot-password</a>.
      </div>
    `),
    }
}

export function emailChangedEmail(opts: { oldEmail: string; newEmail: string; time: string }): MailPayload {
    return {
        to: opts.oldEmail, // notify the OLD email too
        subject: "[ASCI] Email Address Changed",
        html: wrapEmail("Account Security", "Email Address Updated", `
      <p>The email address on your <strong style="color:#fff;">ASCI</strong> account has been changed.</p>
      <div class="info-box">
        <div class="info-row"><span class="label">FROM: </span><span class="value">${opts.oldEmail}</span></div>
        <div class="info-row"><span class="label">TO:   </span><span class="value" style="color:#f26722;">${opts.newEmail}</span></div>
        <div class="info-row"><span class="label">TIME: </span><span class="value">${opts.time}</span></div>
      </div>
      <div class="warn-box">
        <strong style="color:#f26722;">⚠ Wasn't you?</strong><br>
        Contact support immediately — your account may be compromised.
      </div>
    `),
    }
}

export function signupWelcomeEmail(opts: { email: string; name: string }): MailPayload {
    return {
        to: opts.email,
        subject: "[ASCI] Welcome to the Network",
        html: wrapEmail("New Operative", "Welcome to ASCI", `
      <p>Welcome, <strong style="color:#fff;">${opts.name}</strong>. Your operative profile has been created and access to the ASCI network has been granted.</p>
      <div class="info-box">
        <div class="info-row"><span class="label">IDENTITY: </span><span class="value">${opts.email}</span></div>
        <div class="info-row"><span class="label">STATUS:   </span><span class="value" style="color:#4ade80;">ACTIVE</span></div>
      </div>
      <p>Start your journey at your <a href="${getSiteUrl()}/dashboard" style="color:#f26722;">dashboard</a>. Choose a learning path and begin your mission.</p>
    `),
    }
}
