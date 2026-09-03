# Pawspot 🐾

Swipe right to adopt your next best friend. A Tinder-style pet adoption app —
a card deck of full-bleed pet photos, right to adopt, left to pass, and an
"Your adoptions" list of everyone you said yes to.

One repo, one deployable web service: Express serves the API **and** the built
React client on a single port.

## Stack

| Concern | Choice |
|---|---|
| Client | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first, `@tailwindcss/vite`) |
| Components | shadcn/ui |
| Server | Express 5 + TypeScript |
| Database | Postgres |
| ORM / migrations | Drizzle ORM + Drizzle Kit |
| Auth | Better Auth (email + password, Drizzle adapter) |
| Gestures / animation | motion (Framer Motion) |
| Linting | ESLint flat config + typescript-eslint |

## Layout

```
client/          Vite + React app (source only — configs live at the root)
server/src/      Express app, Better Auth, Drizzle client, routes, seed
shared/          Types and enums shared by client and server
drizzle/         Generated migrations (committed)
```

Everything is driven from a single root `package.json`.

## Local setup

**1. Create `.env`** (copy `.env.example`) and fill it in:

```
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_SECRET=<32+ random chars>
BETTER_AUTH_URL=http://localhost:5173
APP_URL=http://localhost:5173
PORT=3000
```

Generate a secret with `openssl rand -base64 32`.

`.env` is git-ignored. Never commit it.

**2. Get a Postgres.** Any Postgres works — a Render database, or a local
container:

```bash
docker run -d --name pawspot-pg \
  -e POSTGRES_USER=pawspot -e POSTGRES_PASSWORD=pawspot -e POSTGRES_DB=pawspot \
  -p 55432:5432 postgres:17-alpine
# DATABASE_URL=postgresql://pawspot:pawspot@localhost:55432/pawspot
```

TLS is negotiated automatically: `localhost` connects unencrypted, anything
else (Render, Neon, …) gets TLS. An explicit `sslmode` in the URL always wins.

**3. Install, migrate, seed, run:**

```bash
npm install
npm run db:migrate   # create the tables
npm run db:seed      # 67 pets — idempotent, safe to re-run
npm run dev          # Vite on :5173, Express on $PORT (default 3000)
```

Open http://localhost:5173. Vite proxies `/api` to Express, so you always use
the Vite port in development.

## Commands

| Script | Does |
|---|---|
| `npm run dev` | Client + server together, with the `/api` proxy |
| `npm run build` | Typecheck, build the client, bundle the server |
| `npm run start` | Run the production server (API + static client, one port) |
| `npm run db:generate` | Create a migration from the Drizzle schema |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |
| `npm run db:seed` | Seed the 67 mock pets |
| `npm run db:studio` | Drizzle Studio |
| `npm run typecheck` | `tsc -b` across client, server and tooling |
| `npm run lint` | `eslint .` |

## API

Better Auth owns `/api/auth/*`. Everything else needs a session cookie.

| Endpoint | Does |
|---|---|
| `GET /api/health` | `{ ok: true }` — no auth, used as Render's health check |
| `GET /api/pets/next?limit=10` | Next pets this user hasn't swiped |
| `POST /api/swipes` | `{ petId, direction: "adopt" \| "pass" }`, unique per (user, pet) |
| `GET /api/matches` | Pets this user swiped "adopt" on |
| `DELETE /api/matches/:petId` | Un-adopt — the pet returns to the deck |

A "match" is just a swipe row with `direction = 'adopt'`; there is no separate
matches table.

The deck is ordered by `md5(pet.id || user.id)` — a per-user shuffle that stays
stable across requests, so paging never repeats or skips a pet.

## Deploying to Render

Push to GitHub, then either use the blueprint or wire it up by hand.

### With the blueprint

Render dashboard → **New → Blueprint** → pick this repo. `render.yaml` creates
the web service and the Postgres database, and wires `DATABASE_URL`,
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `APP_URL` and `NODE_ENV` for you.

### By hand

Create a **Web Service** from the repo plus a **Postgres** instance, then set:

Create a **Web Service** from the repo plus a **Postgres** instance, then set:

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build && npm run db:migrate` |
| Start Command | `npm run start` |
| Health Check Path | `/api/health` |

Environment variables: `DATABASE_URL` (from the database), `BETTER_AUTH_SECRET`
(32+ random chars), and `NODE_ENV=production`. Render provides `PORT` and
`RENDER_EXTERNAL_URL` itself.

The build command above runs migrations, which is what the free tier needs —
Render's separate **Pre-Deploy Command** requires a paid instance type. On a
paid plan you can move `npm run db:migrate` out of the build and into
Pre-Deploy instead, so migrations run before the new version goes live rather
than during the build.

If you skip the migration step entirely the service starts fine and then
returns 500 on the first sign-up, because the `user` table doesn't exist yet.

After the first deploy, seed the pets once from a Render shell (or locally with
`DATABASE_URL` pointed at the production database):

```bash
npm run db:seed
```

Pushes to `main` auto-deploy.

### Getting the URLs right

Better Auth signs its cookies against the app's public URL and rejects
state-changing requests from any other origin, so this value has to be right or
every sign-in fails with `Invalid origin` in the logs.

It resolves in this order, and the first one set wins:

1. `APP_URL` / `BETTER_AUTH_URL` — set these to override anything else.
2. `RENDER_EXTERNAL_URL` — injected by Render into every service, so a
   hand-created service gets its own address with no configuration at all.
3. `http://localhost:5173` — the dev default.

You only need to set `APP_URL` and `BETTER_AUTH_URL` yourself if the app is
served from a custom domain, since `RENDER_EXTERNAL_URL` is the `.onrender.com`
address. Getting it wrong is loud rather than silent: in production the server
warns at boot if the URL is still localhost.
