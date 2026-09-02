import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
// Relative, not aliased: drizzle-kit loads this file with its own bundler,
// which does not know about our tsconfig path aliases.
import { GENDERS, SIZES, SPECIES, SWIPE_DIRECTIONS } from "../../../shared/pets";
import { user } from "./auth-schema";

// Better Auth owns `user`, `session`, `account` and `verification`; re-exported
// here so drizzle-kit sees one schema and the Drizzle adapter gets all tables.
export * from "./auth-schema";

export const speciesEnum = pgEnum("species", SPECIES);
export const genderEnum = pgEnum("gender", GENDERS);
export const sizeEnum = pgEnum("size", SIZES);
export const swipeDirectionEnum = pgEnum("swipe_direction", SWIPE_DIRECTIONS);

export const pets = pgTable("pets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  species: speciesEnum("species").notNull(),
  breed: text("breed").notNull(),
  /** Free text — "8 weeks", "2 years", "senior" all read fine on a card. */
  age: text("age").notNull(),
  gender: genderEnum("gender").notNull(),
  size: sizeEnum("size").notNull(),
  description: text("description").notNull(),
  // Unique so the seed can upsert on it and stay idempotent without deleting
  // rows (which would cascade away everyone's swipes).
  imageUrl: text("image_url").notNull().unique(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * One row per (user, pet) decision. An adoption/"match" is simply a row with
 * `direction = 'adopt'`, so there is no separate matches table.
 */
export const swipes = pgTable(
  "swipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    petId: uuid("pet_id")
      .notNull()
      .references(() => pets.id, { onDelete: "cascade" }),
    direction: swipeDirectionEnum("direction").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // A user may only decide once per pet; re-swiping updates this row.
    unique("swipes_user_id_pet_id_unique").on(table.userId, table.petId),
    // Both the deck ("what haven't I seen?") and matches filter by user.
    index("swipes_user_id_idx").on(table.userId),
  ],
);

export type PetRow = typeof pets.$inferSelect;
export type NewPetRow = typeof pets.$inferInsert;
export type SwipeRow = typeof swipes.$inferSelect;
export type NewSwipeRow = typeof swipes.$inferInsert;
