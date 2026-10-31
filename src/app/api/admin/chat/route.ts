// GET /api/admin/chat -> all conversations (admin only)
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { listThreads } from "@/lib/chat";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, threads: await listThreads() });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load conversations." }, { status: 500 });
  }
}
