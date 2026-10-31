// GET /api/profile -> the logged-in person's extra profile details
// PUT /api/profile -> save username, bio, location and date of birth
// (name and picture are saved with the login system from the browser)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getProfile, saveProfile } from "@/lib/profile";
import { parseProfileInput } from "@/lib/chat-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, profile: await getProfile(session.user.id) });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load your profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const parsed = parseProfileInput(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });

  try {
    const result = await saveProfile(session.user.id, parsed.data);
    return result.ok
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not save your profile." }, { status: 500 });
  }
}
