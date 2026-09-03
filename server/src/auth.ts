import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { env, isProduction } from "./env";

/**
 * RFC 1918 / loopback / unique-local ranges — everything between Render's edge
 * and this process. Anything outside them in `x-forwarded-for` is the client.
 */
const PRIVATE_RANGES = [
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "127.0.0.0/8",
  "::1/128",
  "fc00::/7",
];

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: env.authSecret(),
  baseURL: env.authUrl,
  basePath: "/api/auth",
  // Usually the same URL; listed distinctly in case the two are configured
  // apart, and de-duplicated so the list stays exact.
  trustedOrigins: [...new Set([env.appUrl, env.authUrl])],
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
      secure: isProduction,
    },
    // Render terminates TLS at its edge and reaches us over its private
    // network, so the real client IP only exists in `x-forwarded-for`. Naming
    // the header is not enough: Better Auth refuses to resolve a multi-hop
    // chain unless it can tell which hops are proxies, and returns no IP at
    // all — which puts every visitor in one shared rate-limit bucket, so a
    // single busy client can lock out everyone else.
    //
    // Treating the private ranges as proxies makes it walk the chain from the
    // right and stop at the first public address: the actual client. Enabled
    // only in production, where a proxy is guaranteed to set the header —
    // locally it would be caller-controlled and therefore spoofable.
    ...(isProduction
      ? {
          ipAddress: {
            ipAddressHeaders: ["x-forwarded-for"],
            trustedProxies: PRIVATE_RANGES,
          },
        }
      : {}),
  },
});

export type Session = typeof auth.$Infer.Session;
