const getRoleLabel = (role) => {
  if (role === "admin") return "Admin";
  if (role === "project-manager") return "Project Manager";
  return "User";
};

const getWelcomeHighlights = (role) => {
  if (role === "admin") {
    return [
      "Manage users and permissions",
      "Monitor projects across the whole system",
      "Review reports and overall platform activity",
    ];
  }

  if (role === "project-manager") {
    return [
      "Create and manage projects",
      "Assign tasks and deadlines",
      "Track team delivery and project progress",
    ];
  }

  return [
    "View assigned work from your dashboard",
    "Update task progress in real time",
    "Upload files and meet delivery deadlines",
  ];
};

const buildEmailLayout = ({ title, intro, ctaLabel, ctaUrl, highlights = [], outro }) => ({
  html: `
    <div style="margin:0;padding:32px;background:#090807;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#f7ecda;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(232,214,178,0.18);border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#111111 0%,#18120e 100%);box-shadow:0 24px 60px rgba(0,0,0,0.28);">
        <div style="padding:28px 32px;border-bottom:1px solid rgba(232,214,178,0.10);">
          <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(232,214,178,0.10);border:1px solid rgba(232,214,178,0.14);font-size:12px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#f1ddb4;">
            TaskFlow Nexus
          </div>
          <h1 style="margin:18px 0 0;font-size:34px;line-height:1.2;color:#ffffff;">${title}</h1>
          <p style="margin:14px 0 0;font-size:15px;line-height:1.8;color:#d7c8af;">${intro}</p>
        </div>
        <div style="padding:28px 32px;">
          ${
            highlights.length
              ? `
                <div style="display:grid;gap:12px;">
                  ${highlights
                    .map(
                      (item) => `
                        <div style="padding:16px 18px;border-radius:18px;background:rgba(255,255,255,0.04);border:1px solid rgba(232,214,178,0.10);color:#efe3cf;font-size:14px;line-height:1.6;">
                          ${item}
                        </div>
                      `
                    )
                    .join("")}
                </div>
              `
              : ""
          }
          <div style="margin-top:24px;">
            <a href="${ctaUrl}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#f1ddb4;color:#1b140d;text-decoration:none;font-weight:700;">
              ${ctaLabel}
            </a>
          </div>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.8;color:#d7c8af;">${outro}</p>
        </div>
      </div>
    </div>
  `,
  text: `${title}\n\n${intro}\n\n${highlights.map((item) => `- ${item}`).join("\n")}\n\n${ctaLabel}: ${ctaUrl}\n\n${outro}`,
});

const buildWelcomeEmail = ({ name, role }) => {
  const roleLabel = getRoleLabel(role);
  const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  return {
    subject: `Welcome to TaskFlow Nexus, ${roleLabel}!`,
    ...buildEmailLayout({
      title: `Welcome ${name}, your ${roleLabel} account is ready.`,
      intro: `You have successfully joined TaskFlow Nexus. Your workspace is now prepared so you can start using the platform with your ${roleLabel.toLowerCase()} permissions.`,
      ctaLabel: "Open Dashboard",
      ctaUrl: appUrl,
      highlights: getWelcomeHighlights(role),
      outro: "If you did not create this account, please contact your system administrator immediately.",
    }),
  };
};

const buildResetPasswordEmail = ({ name, resetUrl }) => ({
  subject: "Reset your TaskFlow Nexus password",
  ...buildEmailLayout({
    title: "Password reset request",
    intro: `Hello ${name}, we received a request to reset your password. Use the secure link below to choose a new password. This link expires in 15 minutes.`,
    ctaLabel: "Reset Password",
    ctaUrl: resetUrl,
    highlights: [
      "This link can be used only for a limited time",
      "Use a strong password with at least 6 characters",
      "If you did not request this, you can safely ignore this email",
    ],
    outro: "For security reasons, your current password will remain active until you successfully complete the reset process.",
  }),
});

module.exports = {
  buildWelcomeEmail,
  buildResetPasswordEmail,
};
