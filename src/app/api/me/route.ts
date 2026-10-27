// GET /api/me -> { isAdmin: boolean } so the Navbar knows whether to show the admin link.
import { NextResponse } from "next/server";
import { getSession, isAdminUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ isAdmin: isAdminUser(session?.user) });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
