import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: env.authSecret(),
  baseURL: env.authUrl,
  basePath: "/api/auth",
  trustedOrigins: [env.appUrl],
  emailAndPassword: {
    enabled: true,
    // A pet-adoption toy doesn't need an inbox round-trip to get started.
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh the cookie once a day
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.nodeEnv === "production",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
