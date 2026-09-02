import path from "node:path";
import { toNodeHandler } from "better-auth/node";
import express, { type ErrorRequestHandler } from "express";
import { auth } from "./auth";
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

const server = app.listen(env.port, () => {
  console.log(
    isProduction
      ? `🐾 Pawspot is up — open http://localhost:${env.port}`
      : // In dev the client is Vite's to serve; it prints its own URL.
        `🐾 Pawspot API listening on :${env.port}`,
  );
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
