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

/** A trailing slash breaks Better Auth's exact origin comparison. */
function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Where the app is served from. In dev that's the Vite server (which proxies
 * `/api` to Express); in production Express serves the client itself, so both
 * collapse onto one public URL.
 *
 * `RENDER_EXTERNAL_URL` is injected by Render into every service, so a service
 * created by hand in the dashboard — rather than from `render.yaml` — still
 * knows its own address. Without that fallback this silently becomes
 * `localhost:5173` in production and Better Auth rejects every real request
 * with "Invalid origin".
 */
const appUrl = normalizeUrl(
  process.env.APP_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    "http://localhost:5173",
);

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 3000),
  appUrl,
  authUrl: normalizeUrl(process.env.BETTER_AUTH_URL ?? appUrl),
  /** Lazy so tooling that doesn't touch the DB can still boot. */
  databaseUrl: () => required("DATABASE_URL"),
  authSecret: () => required("BETTER_AUTH_SECRET"),
};

export const isProduction = nodeEnv === "production";
