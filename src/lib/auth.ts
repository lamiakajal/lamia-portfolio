// ==========================================
// Server-side login setup (BetterAuth + MongoDB).
// Login methods: email + password, GitHub and Google (each one turns on
// automatically when its keys exist in .env.local).
// ==========================================

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/mongodb";

const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders = {
  ...(githubId && githubSecret
    ? { github: { clientId: githubId, clientSecret: githubSecret } }
    : {}),
  ...(googleId && googleSecret
    ? { google: { clientId: googleId, clientSecret: googleSecret } }
    : {}),
};

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders,
  // nextCookies() must stay the LAST plugin
  plugins: [nextCookies()],
});
