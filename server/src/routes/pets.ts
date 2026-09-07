import { and, eq, notExists, sql } from "drizzle-orm";
import { Router } from "express";
import type { NextPetsResponse } from "../../../shared/api";
import { db } from "../db";
import { pets, swipes } from "../db/schema";
import { currentUserId, requireAuth } from "../middleware/auth";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const petsRouter = Router();

petsRouter.get("/next", requireAuth, async (req, res, next) => {
  try {
    const userId = currentUserId(req);
    const limit = parseLimit(req.query.limit);

    // "Pets this user hasn't decided on yet."
    const undecided = notExists(
      db
        .select({ one: sql`1` })
        .from(swipes)
        .where(and(eq(swipes.petId, pets.id), eq(swipes.userId, userId))),
    );

    // Shuffle deterministically per user: everyone gets their own deck order,
    // but that order is stable across requests, so paging never repeats or
    // skips a pet the way `order by random()` would.
    const deckOrder = sql`md5(${pets.id}::text || ${userId})`;

    const [rows, [{ remaining }]] = await Promise.all([
      db
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
          shelter: pets.shelter,
        })
        .from(pets)
        .where(undecided)
        .orderBy(deckOrder)
        .limit(limit),
      db
        .select({ remaining: sql<number>`count(*)::int` })
        .from(pets)
        .where(undecided),
    ]);

    const body: NextPetsResponse = {
      pets: rows,
      remaining: Math.max(remaining - rows.length, 0),
    };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

function parseLimit(raw: unknown): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}
