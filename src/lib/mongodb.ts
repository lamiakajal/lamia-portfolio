// ==========================================
// MongoDB connection (one shared client, reused between hot reloads in development).
// Needs MONGODB_URI in .env.local (see .env.example).
// ==========================================

import { MongoClient } from "mongodb";

/** false until MONGODB_URI is set: pages use this to show a friendly message */
export const isDbConfigured = Boolean(process.env.MONGODB_URI);

declare global {
  var __mongoClient: MongoClient | undefined;
}

// The fallback address only keeps the build from crashing when the variable is missing.
const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

export const client = globalThis.__mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalThis.__mongoClient = client;

/** The database used by the whole site (login tables + blog posts) */
export const db = client.db(process.env.MONGODB_DB || "lamia-portfolio");
