import nodemailer from 'nodemailer';

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendOtpEmail(email, otp) {
  const subject = 'Your Uptown sign-in code';
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#faf7f3;padding:28px;color:#241c17">
      <div style="max-width:520px;margin:auto;background:#fff;border-radius:22px;padding:28px;border:1px solid #eaded5">
        <h2 style="margin:0 0 8px;font-size:24px">Uptown sign-in code</h2>
        <p style="font-size:15px;line-height:1.6;margin:0 0 18px;color:#6f625b">Use this code to continue. It expires in 10 minutes.</p>
        <div style="font-size:34px;font-weight:800;letter-spacing:8px;background:#f5ebe3;border-radius:16px;text-align:center;padding:18px 10px">${otp}</div>
        <p style="font-size:13px;color:#8a7b71;margin-top:18px">If you did not request this code, you can ignore this email.</p>
      </div>
    </div>`;

  if (!smtpReady()) {
    console.log(`\nLOCAL OTP for ${email}: ${otp}\nSMTP is not configured, so the OTP was printed here for local testing.\n`);
    return { sent: false, mode: 'console' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || `Uptown <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html
  });
  return { sent: true, mode: 'smtp' };
}
