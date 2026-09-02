import express from "express";
import { env } from "./env";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(env.port, () => {
  console.log(`🐾 Pawspot API listening on http://localhost:${env.port}`);
});
