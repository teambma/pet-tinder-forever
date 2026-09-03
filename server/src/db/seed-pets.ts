import { sql } from "drizzle-orm";
import { SPECIES, type Species } from "../../../shared/pets";
import { db } from "./index";
import { pets } from "./schema";
import { EXPECTED_COUNTS, IMAGE_BASE, SEED_PETS } from "./seed-data";

/**
 * Insert (or refresh) the mock catalogue.
 *
 * Idempotent: pets are keyed by their image URL, so re-running updates the
 * existing rows in place rather than inserting duplicates — and nobody's
 * swipes get cascaded away.
 */
export async function seedPets(): Promise<Record<Species, number>> {
  assertSeedDataIsSound();

  const rows = SEED_PETS.map((pet) => ({
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: pet.age,
    gender: pet.gender,
    size: pet.size,
    description: pet.description,
    imageUrl: `${IMAGE_BASE}${pet.image}`,
    location: pet.location,
  }));

  await db
    .insert(pets)
    .values(rows)
    .onConflictDoUpdate({
      target: pets.imageUrl,
      set: {
        name: sql`excluded.name`,
        species: sql`excluded.species`,
        breed: sql`excluded.breed`,
        age: sql`excluded.age`,
        gender: sql`excluded.gender`,
        size: sql`excluded.size`,
        description: sql`excluded.description`,
        location: sql`excluded.location`,
      },
    });

  return countBySpecies();
}

export async function countPets(): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(pets);
  return row?.total ?? 0;
}

export async function countBySpecies(): Promise<Record<Species, number>> {
  const rows = await db
    .select({ species: pets.species, count: sql<number>`count(*)::int` })
    .from(pets)
    .groupBy(pets.species);

  return Object.fromEntries(
    SPECIES.map((species) => [
      species,
      rows.find((row) => row.species === species)?.count ?? 0,
    ]),
  ) as Record<Species, number>;
}

/** Catches a duplicated image or a miscounted species before we touch the DB. */
function assertSeedDataIsSound() {
  const images = new Set<string>();
  for (const pet of SEED_PETS) {
    if (images.has(pet.image)) {
      throw new Error(`Duplicate seed image: ${pet.image}`);
    }
    images.add(pet.image);
  }

  for (const species of SPECIES) {
    const actual = SEED_PETS.filter((pet) => pet.species === species).length;
    const expected = EXPECTED_COUNTS[species];
    if (actual !== expected) {
      throw new Error(
        `Expected ${expected} ${species}s in the seed data, found ${actual}.`,
      );
    }
  }
}
