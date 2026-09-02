import { Router } from "express";
import type { SwipeResponse } from "../../../shared/api";
import { SWIPE_DIRECTIONS, type SwipeDirection } from "../../../shared/pets";
import { db } from "../db";
import { swipes } from "../db/schema";
import { currentUserId, requireAuth } from "../middleware/auth";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const swipesRouter = Router();

swipesRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const body: unknown = req.body;

    const petId = readString(body, "petId");
    const direction = readString(body, "direction");

    if (!petId || !UUID_RE.test(petId)) {
      res.status(400).json({ error: "petId must be a pet UUID" });
      return;
    }
    if (!isDirection(direction)) {
      res
        .status(400)
        .json({ error: `direction must be one of ${SWIPE_DIRECTIONS.join(", ")}` });
      return;
    }

    // Unique on (userId, petId), so changing your mind updates the same row.
    await db
      .insert(swipes)
      .values({ userId, petId, direction })
      .onConflictDoUpdate({
        target: [swipes.userId, swipes.petId],
        set: { direction, createdAt: new Date() },
      });

    const response: SwipeResponse = { petId, direction };
    res.status(201).json(response);
  } catch (error) {
    // The pet_id FK is the only way a well-formed UUID can fail here.
    if (isForeignKeyViolation(error)) {
      res.status(404).json({ error: "No such pet" });
      return;
    }
    next(error);
  }
});

function readString(body: unknown, key: string): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function isDirection(value: string | undefined): value is SwipeDirection {
  return (
    value !== undefined && (SWIPE_DIRECTIONS as readonly string[]).includes(value)
  );
}

/**
 * Postgres reports a foreign-key violation as SQLSTATE 23503. Drizzle wraps
 * the driver error, so the code can sit a few links down the `cause` chain.
 */
function isForeignKeyViolation(error: unknown): boolean {
  for (let current = error, depth = 0; current && depth < 5; depth += 1) {
    if (typeof current !== "object") return false;
    if ((current as { code?: unknown }).code === "23503") return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}
