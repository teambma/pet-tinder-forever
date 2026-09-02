/**
 * Managed Postgres (Render, and friends) requires TLS, but their certificate
 * chains aren't in Node's trust store — so we require encryption without CA
 * verification. A local database, or an explicit `sslmode` in the URL, is left
 * for `pg` to interpret on its own.
 *
 * Shared by the runtime pool (`db/index.ts`) and drizzle-kit (`drizzle.config.ts`).
 */
export function sslConfig(url: string) {
  if (/[?&]sslmode=/.test(url)) return undefined;

  const { hostname } = new URL(url);
  const isLocal =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  return isLocal ? undefined : { rejectUnauthorized: false };
}
