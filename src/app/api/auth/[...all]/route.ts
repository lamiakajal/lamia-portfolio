// BetterAuth handles every /api/auth/* request (sign in, sign up, sign out, OAuth callbacks).
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
