# VaxCare Healthcare Management System

This is a code bundle for VaxCare Healthcare Management System. The original project is available at https://www.figma.com/design/assvitZB5HnGyP8qd9ED4F/VaxCare-Healthcare-Management-System.

The frontend (React + Vite) is now wired to the real backend (Express + PostgreSQL) — no more mock in-memory data. See `apps/frontend/src/app/lib/api.ts` for the API client.

## 1. Database setup

You need a running PostgreSQL instance. Create the database and load the schema, then optionally load the demo seed data:

```bash
createdb vaxcare
psql -U postgres -d vaxcare -f apps/backend/src/legacy/postgresql/schema.sql
psql -U postgres -d vaxcare -f apps/backend/src/legacy/postgresql/seed.sql   # optional demo data
```

`apps/backend/.env` already has working local defaults (update `DB_PASSWORD` to match your Postgres setup). `apps/frontend/.env` points at `http://localhost:4000/api` — update `VITE_API_URL` if you change the backend port.

## 2. Install & run

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server for both frontend and backend concurrently.
Alternatively, you can run them individually:
- `npm run dev:frontend`
- `npm run dev:backend`

## 3. Demo logins

If you loaded `seed.sql`, these accounts are available:

| Role    | Username     | Password      |
|---------|--------------|---------------|
| Admin   | `admin`      | `admin2025`   |
| Worker  | `ana.reyes`  | `health123`   |
| Worker  | `luz.garcia` | `health123`   |

Resident logins use **Resident ID + Date of Birth** (e.g. `R001` / `1990-03-15`) — any seeded resident works.

