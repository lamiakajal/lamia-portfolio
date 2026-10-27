// ==========================================
// Server helpers: who is logged in, and is this person the admin?
//
// ADMIN RULE: a user is admin only if
//   1) their email is listed in ADMIN_EMAILS (default: lamiakajal@gmail.com) AND
//   2) that email is VERIFIED.
// Rule 2 stops a stranger from registering with your email + a password.
// Log in to the admin area with GitHub or Google (they verify the email for you).
// ==========================================

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "lamiakajal@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export function isAdminUser(
  user: { email?: string | null; emailVerified?: boolean } | null | undefined,
): boolean {
  return Boolean(
    user?.email &&
      user.emailVerified &&
      adminEmails().includes(user.email.toLowerCase()),
  );
}

/** Returns the session when the visitor is the admin, otherwise null */
export async function requireAdmin() {
  const session = await getSession();
  return session && isAdminUser(session.user) ? session : null;
}
