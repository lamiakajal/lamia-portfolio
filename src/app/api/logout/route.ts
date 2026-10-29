// ==========================================
// POST /api/logout
// Signs the visitor out ON THE SERVER: it ends the session in the database and deletes the
// login cookies. (Browser JavaScript cannot delete "httpOnly" cookies, which is why logout
// sometimes seemed to do nothing before.)
// ==========================================

import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    /* even if this fails, the cookies below are still removed */
  }

  const store = await cookies();
  for (const cookie of store.getAll()) {
    if (cookie.name.includes("better-auth")) {
      store.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
        secure: cookie.name.startsWith("__Secure-"),
      });
    }
  }
  return NextResponse.json({ ok: true });
}
