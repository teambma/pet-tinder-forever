import path from "node:path";
import { toNodeHandler } from "better-auth/node";
import express, { type ErrorRequestHandler } from "express";
import { auth } from "./auth";
import { runMigrations } from "./db/migrate";
import { countPets, seedPets } from "./db/seed-pets";
import { env, isProduction } from "./env";
import { matchesRouter } from "./routes/matches";
import { petsRouter } from "./routes/pets";
import { swipesRouter } from "./routes/swipes";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // Render terminates TLS in front of us.

// Better Auth parses its own bodies, so it must be mounted before express.json().
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/pets", petsRouter);
app.use("/api/swipes", swipesRouter);
app.use("/api/matches", matchesRouter);

// Anything else under /api is a real 404, not the client-side router's problem.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
});

if (isProduction) {
  // One service, one port: Express serves the built client and falls through
  // to index.html so client-side routes survive a hard refresh.
  const clientDir = path.resolve(import.meta.dirname, "../client");

  app.use(
    express.static(clientDir, {
      index: false,
      // Vite fingerprints everything under /assets, so it can be cached hard.
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // `/{*splat}` — the braces make the wildcard optional, so this also serves
  // the bare "/" that `express.static({ index: false })` deliberately skips.
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
}

const onError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("Unhandled error:", error);
  if (res.headersSent) return;
  res.status(500).json({ error: "Something went wrong" });
};
app.use(onError);

// Bring the schema up to date before accepting traffic. Skipped in dev, where
// `npm run db:migrate` is explicit and part of the workflow.
if (isProduction) {
  try {
    await runMigrations();
    console.log("🐾 Database schema is up to date.");

    // Pets are fixed reference data, not user data — an empty catalogue means
    // the deck has nothing to show. Only ever fills a blank table; it never
    // touches an existing one.
    if ((await countPets()) === 0) {
      const counts = await seedPets();
      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
      console.log(`🐾 Catalogue was empty — seeded ${total} pets.`);
    }
  } catch (error) {
    console.error(
      "\n✖ Could not prepare the database, so Pawspot won't start.\n" +
        "  Every sign-up would fail against a database with no tables.\n",
      error,
    );
    process.exit(1);
  }
}

const server = app.listen(env.port, () => {
  if (!isProduction) {
    // In dev the client is Vite's to serve; it prints its own URL.
    console.log(`🐾 Pawspot API listening on :${env.port}`);
    return;
  }

  console.log(`🐾 Pawspot is up on :${env.port} — serving ${env.appUrl}`);

  // The public URL is what Better Auth checks every request's Origin against,
  // so if it's still the dev default here, every sign-in will fail. Say so at
  // boot rather than leaving it to be discovered as "Invalid origin" later.
  if (env.appUrl.includes("localhost")) {
    console.warn(
      "⚠ APP_URL is still localhost in production. Set APP_URL (and " +
        "BETTER_AUTH_URL) to this service's public URL, or sign-in will fail " +
        'with "Invalid origin".',
    );
  }
});

// Without this, a port clash exits silently and the app just looks broken:
// Vite still serves the page, but every /api call fails.
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `\n✖ Port ${env.port} is already in use, so the Pawspot API can't start.\n` +
        `  Free that port, or set PORT to something else in .env.\n`,
    );
    process.exit(1);
  }
  throw error;
});
