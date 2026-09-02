import { and, desc, eq } from "drizzle-orm";
import { Router } from "express";
import type { MatchesResponse } from "../../../shared/api";
import { db } from "../db";
import { pets, swipes } from "../db/schema";
import { currentUserId, requireAuth } from "../middleware/auth";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const matchesRouter = Router();

/** Every pet this user swiped right on, newest adoption first. */
matchesRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = currentUserId(req);

    const rows = await db
      .select({
        id: pets.id,
        name: pets.name,
        species: pets.species,
        breed: pets.breed,
        age: pets.age,
        gender: pets.gender,
        size: pets.size,
        description: pets.description,
        imageUrl: pets.imageUrl,
        location: pets.location,
        adoptedAt: swipes.createdAt,
      })
      .from(swipes)
      .innerJoin(pets, eq(pets.id, swipes.petId))
      .where(and(eq(swipes.userId, userId), eq(swipes.direction, "adopt")))
      .orderBy(desc(swipes.createdAt));

    const body: MatchesResponse = {
      matches: rows.map(({ adoptedAt, ...pet }) => ({
        ...pet,
        adoptedAt: adoptedAt.toISOString(),
      })),
    };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

/**
 * Un-adopt. The swipe row is deleted rather than flipped to `pass`, so the pet
 * returns to the deck for a second look.
 */
matchesRouter.delete("/:petId", requireAuth, async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    // Express 5 types a param as `string | string[]`; ours is always a single
    // path segment.
    const petId = String(req.params.petId);

    if (!UUID_RE.test(petId)) {
      res.status(400).json({ error: "petId must be a pet UUID" });
      return;
    }

    const deleted = await db
      .delete(swipes)
      .where(
        and(
          eq(swipes.userId, userId),
          eq(swipes.petId, petId),
          eq(swipes.direction, "adopt"),
        ),
      )
      .returning({ petId: swipes.petId });

    if (deleted.length === 0) {
      res.status(404).json({ error: "Not one of your adoptions" });
      return;
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
