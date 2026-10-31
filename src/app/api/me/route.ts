// GET /api/me -> { isAdmin, unread } for the Navbar badge
//   admin:   unread = new chats + new contact-form messages
//   visitor: unread = Lamia's replies they have not read yet
import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { countUnreadMessages } from "@/lib/engagement";
import { countUnreadForUser, countUnreadThreads } from "@/lib/chat";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ isAdmin: false, unread: 0 });

    const isAdmin = isAdminUser(session.user);
    const unread = isAdmin
      ? (await countUnreadThreads().catch(() => 0)) +
        (await countUnreadMessages().catch(() => 0))
      : await countUnreadForUser(session.user.id).catch(() => 0);
    return NextResponse.json({ isAdmin, unread });
  } catch {
    return NextResponse.json({ isAdmin: false, unread: 0 });
  }
}
