import { createAuthClient } from "better-auth/react";

/**
 * Same-origin: Vite proxies `/api` to Express in dev, and in production
 * Express serves this bundle itself.
 */
export const authClient = createAuthClient({
  basePath: "/api/auth",
});

export const { signIn, signUp, signOut, useSession } = authClient;

export type SessionUser = NonNullable<
  ReturnType<typeof useSession>["data"]
>["user"];
