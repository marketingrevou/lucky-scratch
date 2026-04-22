import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

async function sendToGoogleSheets(name: string, email: string, prize: string) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, prize }),
    });
  } catch (err) {
    console.error("Google Sheets webhook error:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, prize } = body;

  if (!name?.trim() || !email?.trim() || !prize?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPrize = prize.trim();

  const [{ error }] = await Promise.all([
    getSupabaseAdmin().from("game_results").insert({
      name: cleanName,
      email: cleanEmail,
      prize: cleanPrize,
    }),
    sendToGoogleSheets(cleanName, cleanEmail, cleanPrize),
  ]);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
