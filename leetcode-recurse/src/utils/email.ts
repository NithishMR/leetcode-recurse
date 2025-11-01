import nodemailer from "nodemailer";

interface ProblemItem {
  problemName: string;
  problemUrl: string;
  difficulty: string;
  source: string;
}

export async function sendEmailSummary({
  to,
  problems,
}: {
  to: string;
  problems: ProblemItem[];
}) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Build dynamic HTML list
  const problemListHTML = problems
    .map(
      (p) => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding: 8px 12px;">
          <a href="${p.problemUrl}" style="color:#2563eb; font-weight:600; text-decoration:none;">
            ${p.problemName}
          </a>
        </td>
        <td style="padding: 8px 12px; color:#374151;">
          ${p.difficulty}
        </td>
        <td style="padding: 8px 12px; color:#111;">
          ${p.source}
        </td>
      </tr>
    `
    )
    .join("");

  const htmlBody = `
  <div style="font-family:Arial, sans-serif; background:#f7f7f7; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:24px; border-radius:8px; border:1px solid #e5e7eb;">
      <h2 style="color:#111827;">🔔 Daily Review Summary</h2>
      <p style="color:#374151; font-size:15px;">
        Here are the problems scheduled for review today 🚀
      </p>

      <table style="width:100%; border-collapse:collapse; margin-top:14px;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px 12px; color:#6b7280;">Problem</th>
            <th style="text-align:left; padding:8px 12px; color:#6b7280;">Difficulty</th>
            <th style="text-align:left; padding:8px 12px; color:#6b7280;">Source</th>
          </tr>
        </thead>
        <tbody>
          ${problemListHTML}
        </tbody>
      </table>

      <p style="color:#6b7280; font-size:13px; margin-top:24px;">
        Stay consistent and keep improving 💪🚀
      </p>

      <p style="color:#9ca3af; font-size:11px; border-top:1px solid #e5e7eb; padding-top:10px;">
        If you didn’t request this email, simply ignore it.
      </p>
    </div>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Daily Problem Review - From LeetCode Recurse",
      html: htmlBody,
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
}
