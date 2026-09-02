import "dotenv/config";

/**
 * Every secret and environment-specific value the server needs lives here.
 * Nothing is ever hard-coded — locally these come from the git-ignored `.env`,
 * in production from the Render dashboard.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. See .env.example.`,
    );
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

/**
 * Where the app is served from. In dev that's the Vite server (which proxies
 * `/api` to Express); in production Express serves the client itself, so both
 * collapse onto the Render URL.
 */
const appUrl = process.env.APP_URL ?? "http://localhost:5173";

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 3000),
  appUrl,
  authUrl: process.env.BETTER_AUTH_URL ?? appUrl,
  /** Lazy so tooling that doesn't touch the DB can still boot. */
  databaseUrl: () => required("DATABASE_URL"),
  authSecret: () => required("BETTER_AUTH_SECRET"),
};

export const isProduction = nodeEnv === "production";
