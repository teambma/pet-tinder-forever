# CLAUDE.md — Pawspot 🐾 (Pet Adoption, Tinder-style)

This file is the **contract** for building this project. Read it fully before writing any code, and re-read the relevant section before each milestone. `TASKS.md` is the ordered build plan — follow it top to bottom, check off boxes as you go, and **stop at the end of each milestone for human verification before starting the next one.**

---

## 1. What we're building

A full-stack pet adoption web app that feels like Tinder, but for adopting pets. The whole experience is:

1. A **logged-out landing page** that explains the app and pushes the user to sign up / log in.
2. A **swipe deck**: one full-bleed pet photo card at a time. Swipe **right to adopt**, **left to pass**.
3. A **matches view**: the pets the user swiped right on ("Your adoptions").

That's the entire app. Resist scope creep. Anything not in `TASKS.md` is out of scope unless the user asks for it.

### Look & feel
- Mimic Tinder's core interaction and layout closely: a centered card stack, full-bleed image, name + age overlaid on the bottom of the photo, big round action buttons (pass / adopt) under the card, and animated **"ADOPT"** / **"NOPE"** stamps that fade in as you drag.
- But make it **more fun and colorful** than Tinder: playful gradient background, bright accent colors, rounded everything, a little bounce/confetti on a match. Friendly, not corporate.
- **Full-bleed images everywhere they make sense** — the photo should fill the card edge-to-edge (`object-cover`), with a subtle bottom gradient so the overlaid text stays readable.

---

## 2. Tech stack (use exactly these)

| Concern | Choice |
|---|---|
| Build tool / client | **Vite** + **React** + **TypeScript** |
| Styling | **Tailwind CSS** (v4 — CSS-first, via `@tailwindcss/vite`) |
| Components | **shadcn/ui** (installed via its CLI) |
| Server | **Express** + TypeScript |
| Database | **Postgres** |
| ORM / migrations | **Drizzle ORM** + Drizzle Kit |
| Auth | **Better Auth** (email + password) with the Drizzle adapter |
| Linting | **ESLint** (typescript-eslint, flat config) |
| Gestures/animation | **motion** (Framer Motion) for drag + card animations |

Do **not** introduce other major libraries (no Redux, no Next.js, no Prisma, no alternate auth) without asking. Small utilities are fine.

Prefer official scaffolding so versions stay current: `npm create vite@latest`, `npx shadcn@latest init`, and the Better Auth CLI for generating auth tables. Verify APIs against current docs rather than memory when something doesn't compile — these libraries move fast.

---

## 3. Architecture

**One repo, one deployable web service.** Express is the single server. In development, Vite runs its own dev server and proxies `/api` to Express. In production, Vite builds to static files and Express serves them, so there is exactly **one** service and **one** database on Render.

```
/
├── client/                 # Vite + React app (the frontend)
│   ├── src/
│   │   ├── components/      # UI + shadcn components
│   │   ├── features/swipe/  # the card deck
│   │   ├── features/matches/
│   │   ├── pages/          # Landing, App (deck), Matches
│   │   ├── lib/            # auth client, api client, utils
│   │   └── main.tsx
│   └── index.html
├── server/                 # Express + Better Auth + Drizzle
│   ├── src/
│   │   ├── index.ts        # express app, static serving in prod
│   │   ├── auth.ts         # Better Auth instance
│   │   ├── db/
│   │   │   ├── index.ts    # drizzle client (reads DATABASE_URL)
│   │   │   ├── schema.ts   # pets, swipes (+ auth tables live here or auth-schema.ts)
│   │   │   └── seed.ts     # mock-data seeder
│   │   └── routes/         # /api/pets, /api/swipes, /api/matches
├── drizzle/                # generated migrations (committed)
├── drizzle.config.ts
├── render.yaml             # Render blueprint (build/migrate/start)
├── .env                    # LOCAL ONLY, git-ignored — never commit
├── .env.example            # documents required vars, no secrets
├── package.json            # root scripts drive everything
├── CLAUDE.md
├── TASKS.md
└── README.md
```

Keep it a single root `package.json` with all scripts. Don't over-engineer into a heavy monorepo/workspaces setup unless it's genuinely needed.

### API surface
All under `/api`. Better Auth owns `/api/auth/*`. App endpoints require a valid session:
- `GET  /api/health` → `{ ok: true }` (no auth)
- `GET  /api/pets/next?limit=10` → next pets the current user hasn't swiped yet
- `POST /api/swipes` → body `{ petId, direction: "adopt" | "pass" }`, upsert unique per (userId, petId)
- `GET  /api/matches` → pets the user swiped "adopt" on
- `DELETE /api/matches/:petId` → un-adopt (remove/flip the swipe)

Mount Better Auth with `toNodeHandler(auth)` on `app.all("/api/auth/*", ...)` **before** `express.json()`, and read the session in your own routes via `auth.api.getSession({ headers: fromNodeHeaders(req.headers) })` (both from `better-auth/node`). A small `requireAuth` middleware should 401 when there's no session.

---

## 4. Data model

**`pets`** — `id` (uuid/serial), `name`, `species` (`dog|cat|bird|rabbit|reptile`), `breed`, `age` (text like "2 years" is fine), `gender`, `size`, `description`, `imageUrl`, `location`, `createdAt`.

**`swipes`** — `id`, `userId` (fk → user), `petId` (fk → pets), `direction` (`adopt|pass`), `createdAt`. Add a **unique constraint on `(userId, petId)`** so a user can't double-swipe the same pet. A "match"/adoption is simply a swipe with `direction = 'adopt'`.

**Auth tables** (`user`, `session`, `account`, `verification`) — generated by Better Auth's CLI. Don't hand-write these; let the CLI produce the schema, then generate a Drizzle migration for them.

---

## 5. Environment & secrets — read carefully

- **Never hard-code the database URL, the auth secret, or any credential in the codebase or in this file.** All secrets come from `process.env`.
- Required env vars (documented in `.env.example`, real values only in the local git-ignored `.env` and in Render's dashboard):
  - `DATABASE_URL` — Postgres connection string (already provided to you in local `.env`; it's the Render dev database — run migrations and the seed against it).
  - `BETTER_AUTH_SECRET` — 32+ char random string (`openssl rand -base64 32`).
  - `BETTER_AUTH_URL` / `APP_URL` — base URL of the app (`http://localhost:5173` in dev, the Render URL in prod).
  - `PORT` — provided by Render in production; default to 3000 locally.
- `.gitignore` must include `.env`, `node_modules`, `dist`, and build output. Confirm `.env` is ignored **before** the first commit.
- Drizzle config and the db client both read `DATABASE_URL` from the environment. Never inline it.

---

## 6. Commands (define these in root `package.json`)

| Script | Does |
|---|---|
| `dev` | Run client (Vite) and server (tsx watch) together for local dev |
| `build` | Build client (`vite build`) **and** bundle/compile server for production |
| `start` | Run the production server (`node dist/...`), which serves the API + static client |
| `db:generate` | `drizzle-kit generate` (create migration from schema) |
| `db:migrate` | `drizzle-kit migrate` (apply migrations to `DATABASE_URL`) |
| `db:seed` | Run the seed script |
| `db:studio` | `drizzle-kit studio` (handy for verification) |
| `lint` | `eslint .` |

These same scripts are what Render will call — keep them stable and environment-driven. For Render: **Build** = `npm install && npm run build`, **Pre-Deploy** = `npm run db:migrate`, **Start** = `npm run start`. (See `render.yaml`; note the free-tier fallback documented in `TASKS.md` M8.)

---

## 7. Working style & guardrails

- **Follow `TASKS.md` in order. Check off each `- [ ]` as you complete it. At the end of every milestone, stop and tell the user exactly how to verify it, then wait for their go-ahead.** Do not roll ahead into the next milestone on your own.
- Keep each milestone's changes coherent and runnable — the app should be in a working state at every milestone boundary.
- TypeScript strict mode on. No `any` unless truly unavoidable (and comment why). `npm run lint` should pass before you call a milestone done.
- Prefer small, readable modules over cleverness. Share types between client and server where practical.
- Handle the empty state (no more pets to swipe) and loading/error states — don't leave blank screens.
- Accessibility basics: action buttons are real `<button>`s, images have `alt` text, the deck is keyboard-operable on desktop.
- Ask before doing anything destructive to the database beyond the planned migrations/seed. Don't drop tables or wipe data without confirmation.
- If something in this spec conflicts with reality (an API changed, a version won't install), pause and flag it rather than guessing silently.
