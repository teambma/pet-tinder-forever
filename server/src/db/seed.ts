import { SPECIES } from "../../../shared/pets";
import { pool } from "./index";
import { seedPets } from "./seed-pets";

// CLI entry point for `npm run db:seed`. The logic lives in `seed-pets.ts` so
// the server can also seed an empty database on boot.
try {
  const counts = await seedPets();
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  console.log(`🐾 Seeded the catalogue. Database now holds ${total} pets:`);
  for (const species of SPECIES) {
    console.log(`   ${species.padEnd(8)} ${counts[species]}`);
  }
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
