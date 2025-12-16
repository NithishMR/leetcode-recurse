import nodemailer from "nodemailer";

export async function sendWelcomeMailToNewUser({
  to,
  username,
}: {
  to: string;
  username: string;
}) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //
  // 🌤️ LIGHT THEME TEMPLATE
  //
  const htmlBody = `
  <div style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f9fafb;
    padding: 40px 20px;
    color: #111827;
  ">
    <div style="
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    ">
      <h1 style="
        margin: 0 0 12px;
        font-size: 24px;
        font-weight: 600;
        color: #111827;
      ">
        Welcome to Anamnesis - ${username}👋
      </h1>

      <p style="
        margin: 0 0 16px;
        font-size: 15px;
        line-height: 1.6;
        color: #374151;
      ">
        We’re glad to have you here.
      </p>

      <p style="
        margin: 0 0 20px;
        font-size: 15px;
        line-height: 1.6;
        color: #374151;
      ">
        Anamnesis is built to help you organize, reflect, and make sense of your thoughts —
        without noise, clutter, or distractions.
      </p>

      <div style="
        margin: 24px 0;
        padding: 16px;
        background-color: #f3f4f6;
        border-radius: 8px;
        font-size: 14px;
        color: #374151;
      ">
        ✨ Tip: Start by creating your first entry. Keep it simple — even a single line is enough.
      </div>

      <p style="
        margin: 24px 0 0;
        font-size: 14px;
        color: #6b7280;
      ">
        If you didn’t sign up for Anamnesis, you can safely ignore this email.
      </p>

      <hr style="
        margin: 28px 0;
        border: none;
        border-top: 1px solid #e5e7eb;
      " />

      <p style="
        margin: 0;
        font-size: 13px;
        color: #9ca3af;
        text-align: center;
      ">
        © ${new Date().getFullYear()} Anamnesis
      </p>
    </div>
  </div>
`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Hi ${username}, Welcome to Anamnesis`,
      html: htmlBody,
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
}
