// ==========================================
// The public address of the website, used for login redirects (Google / GitHub callbacks).
//
// - Local testing:  BETTER_AUTH_URL=http://localhost:3000  (in .env.local)
// - Live site:      BETTER_AUTH_URL=https://lamiakajal.com (in Vercel environment variables)
//
// Safety net: on the live (production) server a "localhost" value is ignored and the
// real domain is used, because a localhost address there is the usual reason for
// "redirect_uri_mismatch" / "redirect_uri is not associated with this application".
// ==========================================

const LIVE_URL = "https://lamiakajal.com";

export function resolveBaseUrl(): string | undefined {
  const fromEnv = process.env.BETTER_AUTH_URL?.trim().replace(/\/$/, "");
  const isProduction = process.env.NODE_ENV === "production";
  const looksLocal = Boolean(fromEnv && /localhost|127\.0\.0\.1/.test(fromEnv));

  if (fromEnv && !(isProduction && looksLocal)) return fromEnv;
  return isProduction ? LIVE_URL : undefined;
}
