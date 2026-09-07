/**
 * Vocabulary shared by the Drizzle schema, the API and the React client.
 * Keeping the tuples here means the DB enums and the TS unions can never
 * drift apart.
 */

export const SPECIES = ["dog", "cat", "bird", "rabbit", "reptile"] as const;
export type Species = (typeof SPECIES)[number];

export const GENDERS = ["male", "female"] as const;
export type Gender = (typeof GENDERS)[number];

export const SIZES = ["small", "medium", "large"] as const;
export type Size = (typeof SIZES)[number];

export const SWIPE_DIRECTIONS = ["adopt", "pass"] as const;
export type SwipeDirection = (typeof SWIPE_DIRECTIONS)[number];

/** A pet as the API hands it to the client. */
export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  gender: Gender;
  size: Size;
  description: string;
  imageUrl: string;
  location: string;
  shelter: string;
}
