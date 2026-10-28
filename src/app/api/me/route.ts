// GET /api/me -> { isAdmin, unread }  so the Navbar knows what to show in the account menu.
import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";
import { countUnreadMessages } from "@/lib/engagement";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const isAdmin = isAdminUser(session?.user);
    const unread = isAdmin ? await countUnreadMessages().catch(() => 0) : 0;
    return NextResponse.json({ isAdmin, unread });
  } catch {
    return NextResponse.json({ isAdmin: false, unread: 0 });
  }
}
