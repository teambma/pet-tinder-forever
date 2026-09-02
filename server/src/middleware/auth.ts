import { fromNodeHeaders } from "better-auth/node";
import type { Request, RequestHandler } from "express";
import { auth, type Session } from "../auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Populated by `requireAuth`; absent on unprotected routes. */
      session?: Session;
    }
  }
}

/** 401s unless the request carries a valid Better Auth session cookie. */
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Not signed in" });
      return;
    }

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Reads the signed-in user's id. Only valid inside a route mounted behind
 * `requireAuth` — the throw is a programming-error guard, not a 401 path.
 */
export function currentUserId(req: Request): string {
  const id = req.session?.user.id;
  if (!id) {
    throw new Error("currentUserId() used on a route without requireAuth");
  }
  return id;
}
