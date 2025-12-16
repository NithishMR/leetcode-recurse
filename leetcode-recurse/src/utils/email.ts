import nodemailer from "nodemailer";

interface ProblemItem {
  _id: any;
  problemName: string;
  problemUrl: string;
  difficulty: string;
  source: string;
}

const getDifficultyStyles = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  if (d === "easy") return { color: "#059669", background: "#ECFDF5" }; // green
  if (d === "medium") return { color: "#D97706", background: "#FFFBEB" }; // amber
  if (d === "hard") return { color: "#DC2626", background: "#FEF2F2" }; // red
  return { color: "#4B5563", background: "#F3F4F6" }; // gray
};

const buildProblemListHTML = (problems: ProblemItem[]) => {
  return problems
    .map((p) => {
      const { color, background } = getDifficultyStyles(p.difficulty);

      return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding: 12px 16px; font-size:15px; background:#ffffff;">
          <a href="https://anamnesis-beta.vercel.app/view-problems/${p._id}"
             style="color:#2563EB; font-weight:600; text-decoration:none;"
             target="_blank">
            ${p.problemName}
          </a>
        </td>

        <td style="padding: 12px 16px; background:#ffffff;">
          <span style="
            color:${color};
            background-color:${background};
            padding: 4px 10px;
            border-radius: 8px;
            font-size:13px;
            font-weight:700;
            text-transform:capitalize;
            white-space:nowrap;
          ">
            ${p.difficulty}
          </span>
        </td>

        <td style="padding: 12px 16px; font-size:14px; color:#4b5563; background:#ffffff;">
          ${p.source}
        </td>
      </tr>`;
    })
    .join("");
};

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

  const problemListHTML = buildProblemListHTML(problems);

  //
  // 🌤️ LIGHT THEME TEMPLATE
  //
  const htmlBody = `
  <div style="font-family:'Inter', Arial, sans-serif; background-color:#f4f6f8; padding:40px 0; line-height:1.5;">
    <div style="
      max-width:680px;
      margin:auto;
      background-color:#ffffff;
      border-radius:12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border:1px solid #e5e7eb;
      overflow:hidden;
    ">

      <!-- HEADER -->
      <div style="background-color:#ffffff; padding:28px 32px 20px 32px; border-bottom:1px solid #e5e7eb; text-align:center;">
        <h1 style="margin:0; color:#1f2937; font-size:24px; font-weight:700;">
          📘 Daily Review Summary
        </h1>
        <p style="margin:8px 0 0; color:#6b7280; font-size:15px;">
          Your spaced-repetition tasks for today.
        </p>
      </div>

      <!-- CONTENT -->
      <div style="padding:32px;">
        <h3 style="margin:0 0 16px; color:#1f2937; font-size:18px;">
          Problems to Review
        </h3>

        <table style="width:100%; border-collapse:collapse; margin-top:10px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; background:#ffffff;">
          <thead>
            <tr style="background-color:#f9fafb;">
              <th style="text-align:left; padding:10px 16px; color:#4b5563; font-weight:600; font-size:14px;">Problem</th>
              <th style="text-align:left; padding:10px 16px; color:#4b5563; font-weight:600; font-size:14px; width:100px;">Difficulty</th>
              <th style="text-align:left; padding:10px 16px; color:#4b5563; font-weight:600; font-size:14px; width:100px;">Source</th>
            </tr>
          </thead>
          <tbody>
            ${problemListHTML}
          </tbody>
        </table>

        <p style="color:#4b5563; font-size:15px; margin-top:30px; text-align:center;">
          <b style="color:#111827;">Stay consistent.</b> Every session brings improvement 🚀✨
        </p>
      </div>

      <!-- FOOTER -->
      <div style="padding:20px 32px; text-align:center; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 4px; color:#9ca3af; font-size:12px;">
          You are receiving this email because reminders are enabled in <b style="color:#6b7280;">Anamnesis</b>.
        </p>
        <p style="margin:0; color:#a1a1aa; font-size:12px;">
          © ${new Date().getFullYear()} Anamnesis — Improve Every Day.
        </p>
      </div>

    </div>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Daily Review Summary — Anamnesis",
      html: htmlBody,
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
}
