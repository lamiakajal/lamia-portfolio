// GET  /api/admin/chat/[id]         -> one conversation (opening it marks it as read)
// POST /api/admin/chat/[id] { text } -> reply to the visitor
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getThreadMessages, sendAdminReply } from "@/lib/chat";
import { MAX_CHAT_LENGTH } from "@/lib/chat-types";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  const { id } = await params;
  try {
    const data = await getThreadMessages(id);
    return data
      ? NextResponse.json({ ok: true, ...data })
      : NextResponse.json({ ok: false, error: "Conversation not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load the conversation." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Context) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (text.length < 1 || text.length > MAX_CHAT_LENGTH) {
    return NextResponse.json({ ok: false, error: `Replies can be 1 to ${MAX_CHAT_LENGTH} characters.` }, { status: 400 });
  }
  try {
    const message = await sendAdminReply(id, text);
    return message
      ? NextResponse.json({ ok: true, message })
      : NextResponse.json({ ok: false, error: "Conversation not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not send the reply." }, { status: 500 });
  }
}
