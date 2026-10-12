import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
export const dynamic = "force-dynamic";
const ok = (data: unknown, status = 200) => NextResponse.json(data, { status });
export async function GET(request: NextRequest) {
  const user = await getChatGPTUser(); if (!user) return ok({ error: "Sign in required" }, 401);
  const type = request.nextUrl.searchParams.get("type");
  const query = type ? env.DB!.prepare("SELECT * FROM records WHERE user_id = ? AND type = ? ORDER BY sort_order, created_at DESC").bind(user.userId, type) : env.DB!.prepare("SELECT * FROM records WHERE user_id = ? ORDER BY sort_order, created_at DESC").bind(user.userId);
  const [profile, list] = await Promise.all([env.DB!.prepare("SELECT * FROM profiles WHERE user_id = ?").bind(user.userId).first(), query.all()]);
  return ok({ profile, records: list.results.map((row) => normalize(row as Record<string, unknown>)) });
}
export async function POST(request: NextRequest) {
  const user = await getChatGPTUser(); if (!user) return ok({ error: "Sign in required" }, 401); const body = await request.json(); const now = new Date().toISOString();
  if (body.kind === "profile") { await env.DB!.prepare("INSERT INTO profiles (user_id,name,wake_time,sleep_time,work_days,setup_complete,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET name=excluded.name,wake_time=excluded.wake_time,sleep_time=excluded.sleep_time,work_days=excluded.work_days,setup_complete=excluded.setup_complete,updated_at=excluded.updated_at").bind(user.userId, clean(body.name, 80), body.wakeTime || "07:00", body.sleepTime || "22:30", clean(body.workDays || "", 100), 1, now).run(); return ok({ saved: true }); }
  const id = crypto.randomUUID(); await env.DB!.prepare("INSERT INTO records (id,user_id,type,title,data,sort_order,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").bind(id, user.userId, clean(body.type, 30), clean(body.title, 160), JSON.stringify(body.data || {}), Number(body.sortOrder || 0), body.completed ? 1 : 0, now, now).run();
  return ok({ record: { id, type: body.type, title: body.title, data: body.data || {}, sortOrder: Number(body.sortOrder || 0), completed: !!body.completed, createdAt: now, updatedAt: now } }, 201);
}
export async function PATCH(request: NextRequest) {
  const user = await getChatGPTUser(); if (!user) return ok({ error: "Sign in required" }, 401); const body = await request.json();
  const existing = await env.DB!.prepare("SELECT * FROM records WHERE id = ? AND user_id = ?").bind(body.id, user.userId).first<Record<string, unknown>>(); if (!existing) return ok({ error: "Not found" }, 404);
  const data = body.data ?? JSON.parse(String(existing.data || "{}")); await env.DB!.prepare("UPDATE records SET title=?,data=?,sort_order=?,completed=?,updated_at=? WHERE id=? AND user_id=?").bind(clean(body.title ?? existing.title, 160), JSON.stringify(data), Number(body.sortOrder ?? existing.sort_order ?? 0), body.completed ?? existing.completed ? 1 : 0, new Date().toISOString(), body.id, user.userId).run(); return ok({ saved: true });
}
export async function DELETE(request: NextRequest) { const user = await getChatGPTUser(); if (!user) return ok({ error: "Sign in required" }, 401); const id = request.nextUrl.searchParams.get("id"); if (!id) return ok({ error: "Missing id" }, 400); await env.DB!.prepare("DELETE FROM records WHERE id = ? AND user_id = ?").bind(id, user.userId).run(); return ok({ deleted: true }); }
function clean(value: unknown, max: number) { return String(value ?? "").trim().slice(0, max); }
function normalize(row: Record<string, unknown>) { return { id: row.id, type: row.type, title: row.title, data: JSON.parse(String(row.data || "{}")), sortOrder: row.sort_order, completed: !!row.completed, createdAt: row.created_at, updatedAt: row.updated_at }; }
