// GET  /api/chat           -> my conversation with Lamia (opening it marks her replies as read)
// POST /api/chat { text }  -> send Lamia a message
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserChat, sendUserMessage } from "@/lib/chat";
import { emailAdminNewMessage } from "@/lib/notify";
import { MAX_CHAT_LENGTH } from "@/lib/chat-types";

export const dynamic = "force-dynamic";

// Max 12 messages per person per 10 minutes
const recent = new Map<string, number[]>();
function tooMany(userId: string) {
  const now = Date.now();
  const list = (recent.get(userId) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  recent.set(userId, list);
  return list.length > 12;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, messages: await getUserChat(session.user.id) });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load your messages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Please log in to send a message." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (text.length < 2 || text.length > MAX_CHAT_LENGTH) {
    return NextResponse.json({ ok: false, error: `Messages can be 2 to ${MAX_CHAT_LENGTH} characters.` }, { status: 400 });
  }
  if (tooMany(session.user.id)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please wait a few minutes." }, { status: 429 });
  }

  try {
    const message = await sendUserMessage(
      {
        id: session.user.id,
        name: session.user.name || "Reader",
        email: session.user.email,
        image: session.user.image ?? null,
      },
      text,
    );
    void emailAdminNewMessage(session.user.name || "Reader", session.user.email, text);
    return NextResponse.json({ ok: true, message });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }
}
