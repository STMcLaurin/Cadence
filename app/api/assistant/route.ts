import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await request.json();
  const message = String(body.message || "").trim().slice(0, 4000);
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });
  const key = (env as any).OPENAI_API_KEY || (env as any).AI_API_KEY;
  if (!key) return NextResponse.json({ configured: false, reply: "Your local Cadence assistant is ready. Add an AI provider key to enable deeper answers." }, { status: 200 });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: (env as any).OPENAI_MODEL || "gpt-4.1-mini",
      instructions: "You are Cadence, a warm and practical life-organization assistant. Give concise, actionable guidance. Never claim to have changed data unless the app confirms it.",
      input: `User context: ${String(body.context || "No context supplied").slice(0, 2000)}\n\nUser request: ${message}`,
      max_output_tokens: 500,
    }),
  });
  if (!response.ok) return NextResponse.json({ configured: true, error: "AI provider unavailable" }, { status: 502 });
  const data = await response.json() as any;
  const reply = data.output_text || data.output?.flatMap((item:any)=>item.content||[]).map((part:any)=>part.text||"").join(" ") || "I could not generate a response right now.";
  return NextResponse.json({ configured: true, reply });
}
