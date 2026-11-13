import type { ConsultationInput } from "@/lib/consultation";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function formatReceivedAt(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  }).format(date);
}

/** The language the visitor used on the site, so the reply can match it. */
const languageName = (d: ConsultationInput) => (d.locale === "ar" ? "Arabic (عربي)" : "English");

export function consultationSubject(d: ConsultationInput) {
  return `New consultation request: ${d.fullName} (${d.projectType})`;
}

export function consultationText(d: ConsultationInput, receivedAt: string) {
  return [
    "New consultation request",
    "",
    `Full name:     ${d.fullName}`,
    `Mobile:        ${d.phone}`,
    `Email:         ${d.email}`,
    `Project type:  ${d.projectType}`,
    `Language:      ${languageName(d)}`,
    "",
    "Notes:",
    d.notes || "No notes added.",
    "",
    `Received: ${receivedAt} (Cairo time)`,
    "Reply to this email to answer the client directly.",
  ].join("\n");
}

export function consultationHtml(d: ConsultationInput, receivedAt: string) {
  const phoneHref = d.phone.replace(/[^\d+]/g, "");
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #e4ddd1;width:140px;vertical-align:top;font:14px/1.5 Arial,Helvetica,sans-serif;color:#7d776e;">${label}</td>
      <td style="padding:14px 0;border-bottom:1px solid #e4ddd1;vertical-align:top;font:15px/1.5 Arial,Helvetica,sans-serif;color:#1d1f1c;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f2eee7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2eee7;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;">
        <tr>
          <td style="background:#1d1f1c;padding:28px 36px;">
            <div style="font:18px/1.2 Georgia,'Times New Roman',serif;color:#ece6db;letter-spacing:1px;">Mohamed Elsaeed</div>
            <div style="font:12px/1.4 Arial,Helvetica,sans-serif;color:#bdb4a6;letter-spacing:2px;margin-top:4px;">Home Design</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 36px 8px;">
            <div style="font:24px/1.3 Georgia,'Times New Roman',serif;color:#1d1f1c;">New consultation request</div>
            <div style="font:14px/1.5 Arial,Helvetica,sans-serif;color:#7d776e;margin-top:8px;">Received ${esc(receivedAt)} (Cairo time)</div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e4ddd1;">
              ${row("Full name", `<span dir="auto">${esc(d.fullName)}</span>`)}
              ${row("Mobile", `<a href="tel:${esc(phoneHref)}" style="color:#1d1f1c;">${esc(d.phone)}</a>`)}
              ${row("Email", `<a href="mailto:${esc(d.email)}" style="color:#1d1f1c;">${esc(d.email)}</a>`)}
              ${row("Project type", esc(d.projectType))}
              ${row("Language", esc(languageName(d)))}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px 8px;">
            <div style="font:14px/1.5 Arial,Helvetica,sans-serif;color:#7d776e;margin-bottom:8px;">Notes</div>
            <div dir="auto" style="font:15px/1.7 Arial,Helvetica,sans-serif;color:#1d1f1c;background:#f7f4ef;padding:18px 20px;white-space:pre-wrap;text-align:start;">${d.notes ? esc(d.notes) : '<span style="color:#7d776e;">No notes added.</span>'}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 36px;">
            <a href="mailto:${esc(d.email)}?subject=${encodeURIComponent("Your consultation with Mohamed Elsaeed – Home Design")}" style="display:inline-block;background:#1d1f1c;color:#ece6db;text-decoration:none;font:14px/1 Arial,Helvetica,sans-serif;letter-spacing:.5px;padding:15px 24px;">Reply to ${esc(d.fullName.split(" ")[0])}</a>
            <a href="tel:${esc(phoneHref)}" style="display:inline-block;color:#1d1f1c;text-decoration:underline;font:14px/1 Arial,Helvetica,sans-serif;padding:15px 0 15px 20px;">Call ${esc(d.phone)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 36px;border-top:1px solid #e4ddd1;font:12px/1.5 Arial,Helvetica,sans-serif;color:#7d776e;">
            Sent from the consultation form on the Mohamed Elsaeed – Home Design website.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
