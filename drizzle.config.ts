import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { sslConfig } from "./server/src/db/ssl";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "Missing required environment variable DATABASE_URL. See .env.example.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url,
    ssl: sslConfig(url),
  },
  verbose: true,
  strict: true,
});
