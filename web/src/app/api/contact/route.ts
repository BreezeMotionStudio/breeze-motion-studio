import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchSafe } from "@/lib/sanity/fetchSafe";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

const FALLBACK_TO_EMAIL = "info@breezemotionstudio.com";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const company = body?.company?.trim();
  const message = body?.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
  }

  // TEMPORARY: Resend's sandbox mode (no verified sending domain yet) only allows
  // delivery to the account's own signup address. Once breezemotionstudio.com is
  // verified as a sending domain in Resend, remove CONTACT_TO_EMAIL_OVERRIDE from
  // .env.local (and Vercel) so this falls back to the real configured contact email.
  const settings = await fetchSafe(SITE_SETTINGS_QUERY, {}, null);
  const to = process.env.CONTACT_TO_EMAIL_OVERRIDE || settings?.contactEmail || FALLBACK_TO_EMAIL;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Breeze Motion Studio Website <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "—"}`,
        "",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
    }
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
