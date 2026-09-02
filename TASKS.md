# TASKS.md — Build Plan 🐾

Build the app milestone by milestone. **Rules:**

- Work top to bottom. Don't skip ahead.
- Check off each `- [ ]` box as you finish it (change `[ ]` to `[x]`).
- At the **end of each milestone**, stop, run the milestone's **✅ Verify** steps, and tell the user how to confirm it works. **Wait for their approval before starting the next milestone.**
- The app must be runnable at every milestone boundary.

---

## M0 — Project scaffolding & tooling

- [x] Initialize a single git repo with a root `package.json`.
- [x] Create `.gitignore` including `.env`, `node_modules`, `dist`, and build artifacts. Confirm `.env` is ignored **before** the first commit.
- [x] Scaffold the Vite + React + TypeScript client under `client/`.
- [x] Add Tailwind CSS v4 via `@tailwindcss/vite` and `@import "tailwindcss";` in the client's main CSS. Confirm a Tailwind utility class visibly works.
- [x] Initialize shadcn/ui with its CLI and add one test component (e.g. `Button`) to prove wiring.
- [x] Set up ESLint (flat config, typescript-eslint) and a `lint` script; make it pass.
- [x] Create a minimal Express + TypeScript server under `server/` with `GET /api/health` → `{ ok: true }`.
- [x] Wire the `dev` script to run client and server together, with Vite proxying `/api` → Express.
- [x] Create `.env.example` listing `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`/`APP_URL`, `PORT` (no real values).

**✅ Verify:** `npm run dev` starts both. The client page loads with a working Tailwind-styled button. Visiting the health endpoint (through the proxy) returns `{ ok: true }`. `npm run lint` passes.

---

## M1 — Database connection & core schema

- [ ] Add `drizzle.config.ts` (`dialect: 'postgresql'`, schema path set, `dbCredentials.url: process.env.DATABASE_URL`).
- [ ] Create the Drizzle client in `server/src/db/index.ts`, reading `DATABASE_URL` from env (no hard-coded string).
- [ ] Define `pets` and `swipes` tables in `schema.ts` per the CLAUDE.md data model, including the unique `(userId, petId)` constraint on `swipes`. (The `userId` FK can reference the auth `user` table added in M3 — structure it so M3 slots in cleanly.)
- [ ] `npm run db:generate` to create the first migration; commit the generated SQL.
- [ ] `npm run db:migrate` to apply it to the dev database (`DATABASE_URL`).

**✅ Verify:** Migration runs cleanly against the dev DB. `npm run db:studio` (or a `\dt` in psql) shows the `pets` and `swipes` tables with the expected columns and the unique constraint.

---

## M2 — Seed the database with mock pets

Use the provided image URLs. Base path: `https://pets-images.dev-apis.com/pets/`

- [ ] Write `server/src/db/seed.ts` that inserts pets with realistic-but-fun mock data (name, breed, age, gender, size, a short playful description, location) and the correct `imageUrl`:
  - [ ] **Dogs** — `dog1.jpg` … `dog39.jpg` (39)
  - [ ] **Cats** — `cat1.jpg` … `cat14.jpg` (14)
  - [ ] **Birds** — `bird1.jpg` … `bird9.jpg` (9)
  - [ ] **Rabbits** — `rabbit1.jpg` … `rabbit3.jpg` (3)
  - [ ] **Reptiles** — `reptile1.jpg`, `reptile2.jpg` (2, the boutique selection 🦎)
- [ ] Make the seed **idempotent** (safe to re-run — clear or upsert pets, don't duplicate).
- [ ] Add the `db:seed` script and run it against the dev DB.

**✅ Verify:** Total 67 pets in the DB with the right per-species counts. Spot-check a few `imageUrl`s load in a browser. Re-running `db:seed` doesn't create duplicates.

---

## M3 — Authentication (Better Auth)

- [ ] Add the Better Auth instance in `server/src/auth.ts` using the Drizzle adapter (`provider: "pg"`) and email + password enabled.
- [ ] Generate the auth tables (`user`, `session`, `account`, `verification`) via the Better Auth CLI, produce a Drizzle migration for them, and apply it.
- [ ] Mount `toNodeHandler(auth)` at `app.all("/api/auth/*", ...)` **before** `express.json()`.
- [ ] Add a `requireAuth` middleware that reads the session (`auth.api.getSession` + `fromNodeHeaders`) and 401s when absent.
- [ ] Set up the Better Auth **client** in `client/src/lib/auth.ts` and wire sign-up, sign-in, sign-out, and a session hook.
- [ ] Protect the app routes/endpoints so only authenticated users reach the deck and matches.

**✅ Verify:** A new user can sign up, log out, and log back in; the session persists on refresh. A protected endpoint (e.g. `/api/pets/next`) returns 401 when logged out and 200 when logged in.

---

## M4 — Logged-out landing page

- [ ] Build a minimal, colorful landing page: what Pawspot is (swipe to adopt pets), a friendly hero with playful gradient + imagery, and clear **Sign up / Log in** calls to action.
- [ ] Route logic: logged-out users see the landing page; logged-in users are redirected to the swipe deck.
- [ ] Sign-up / log-in UI (shadcn form components) wired to the M3 auth client, with error states.

**✅ Verify:** Logged out → landing page with working auth CTAs. After logging in → redirected into the app. Refreshing while logged in keeps you in the app.

---

## M5 — Swipe deck (desktop: mouse-drag + arrow keys)

- [ ] `GET /api/pets/next` returns pets the current user hasn't swiped, excluding already-swiped ones.
- [ ] Build the card stack: top card shows a **full-bleed** pet photo (`object-cover`, edge-to-edge) with a bottom gradient and the pet's name + age overlaid; a peek of the next card behind it.
- [ ] Drag with the mouse (via `motion`): card follows the cursor, rotates slightly, and fades in an **"ADOPT"** stamp when dragging right / **"NOPE"** when dragging left. Releasing past a threshold commits the swipe; otherwise it springs back.
- [ ] **Arrow keys**: `←` = pass, `→` = adopt, with the same animation.
- [ ] Big round **pass / adopt** buttons under the card that do the same thing.
- [ ] On each swipe, `POST /api/swipes` and advance the stack. Prefetch/queue so it stays smooth and never shows a swiped pet again.

**✅ Verify:** On desktop you can swipe by dragging, by arrow keys, and by buttons. Swipes persist (reload doesn't resurface swiped pets). Stamps and animations feel Tinder-like.

---

## M6 — Mobile gestures & polish

- [ ] Touch swipe works on mobile/touch devices (pointer events should unify this — verify on a real touch viewport).
- [ ] Layout is responsive and looks great on a phone: card fills the screen nicely, buttons are thumb-reachable.
- [ ] Empty state when there are no more pets ("You've met everyone! 🐾"), plus loading and error states.
- [ ] A little delight on an adopt (bounce and/or confetti). Keep it tasteful and performant.

**✅ Verify:** In a mobile viewport (or real phone), swiping by touch works and the layout is clean. Swiping through all pets shows the empty state gracefully.

---

## M7 — Matches ("Your adoptions")

- [ ] `GET /api/matches` returns pets the user swiped **adopt** on.
- [ ] A matches view listing those pets (full-bleed thumbnails, name, species) reachable from the deck (e.g. a tab or header link).
- [ ] `DELETE /api/matches/:petId` to un-adopt, with the UI updating immediately.
- [ ] Empty state for no matches yet.

**✅ Verify:** Right-swiped pets appear under matches; un-adopting removes them; the count/state stays consistent after reload.

---

## M8 — Production build & Render deployment

- [ ] Make the production server serve the built client static files and fall through to the API — one service, one port (uses `PORT`).
- [ ] `npm run build` builds the client and bundles/compiles the server; `npm run start` runs the built server and serves the whole app on one port.
- [ ] Add `render.yaml` (a web service + the Postgres DB) with:
  - **Build Command:** `npm install && npm run build`
  - **Pre-Deploy Command:** `npm run db:migrate` (runs migrations before the new version starts)
  - **Start Command:** `npm run start`
  - Env vars wired: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`/`APP_URL`, `NODE_ENV=production`.
  - **Note the free-tier caveat:** Render's separate Pre-Deploy step requires a paid instance. If deploying on the free tier, fold the migration into the build command instead (`... && npm run build && npm run db:migrate`). Document both in the README.
- [ ] Write `README.md`: local setup (create `.env`, install, migrate, seed, dev), and the deploy story — push to GitHub, connect the repo to Render (or use the blueprint), set env vars in the Render dashboard, and let it auto-deploy on push.
- [ ] Final pass: `npm run lint` clean, no secrets committed, `.env` still git-ignored.

**✅ Verify:** Locally, `npm run build` then `npm run start` serves the full app (landing → auth → swipe → matches) on a single port with no Vite dev server running. `render.yaml` is present and the build/migrate/start commands are correct. Ready to push to GitHub and deploy.

---

### Definition of done
Logged-out landing page → sign up / log in → swipe deck (mouse-drag, arrow keys, and touch) with full-bleed pet photos and Tinder-style stamps → matches view — all backed by Postgres via Drizzle, authed with Better Auth, seeded with the mock pets, and deployable to Render from a GitHub push.
