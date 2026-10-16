import { Resend } from "resend";

const FIELDS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  businessType: "Business type",
  location: "Location",
  message: "Tell us about your space",
} as const;

type Key = keyof typeof FIELDS;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return Response.json({ error: "Email is not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const data = {} as Record<Key, string>;
  for (const key of Object.keys(FIELDS) as Key[]) {
    const value = typeof body?.[key] === "string" ? (body[key] as string).trim() : "";
    if (!value) return Response.json({ error: `${FIELDS[key]} is required` }, { status: 400 });
    data[key] = value.slice(0, 5000);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ error: "Email is invalid" }, { status: 400 });
  }

  const rows = (Object.keys(FIELDS) as Key[])
    .map(
      (k) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6d6d6d;vertical-align:top">${FIELDS[k]}</td><td style="padding:6px 0;white-space:pre-wrap">${escape(data[k])}</td></tr>`,
    )
    .join("");

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: CONTACT_FROM_EMAIL || "Vendiq <onboarding@resend.dev>",
    to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
    replyTo: data.email,
    subject: `New enquiry from ${data.firstName} ${data.lastName}`,
    html: `<table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
    text: (Object.keys(FIELDS) as Key[]).map((k) => `${FIELDS[k]}: ${data[k]}`).join("\n"),
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return Response.json({ error: "Could not send message" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
