# Virtual Clinic API

REST API for multi-turn conversations with LLM-based simulated patient agents, powered by Synthea-generated electronic health records.

Workshop participants conduct clinical interviews with synthetic patients to practice diagnosis, treatment planning, and clinical event prediction.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, route handlers)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL 17
- [Vercel AI SDK](https://sdk.vercel.ai/) + Azure OpenAI
- [jose](https://github.com/panva/jose) (JWT authentication)
- [Zod](https://zod.dev/) (request validation)
- [Scalar](https://scalar.com/) (interactive API docs)
- TypeScript 5.9

## Quick Start

```bash
# 1. Set up environment variables
cp .env.example .env

# 2. Start PostgreSQL (Docker)
pnpm db:up

# 3. Push the database schema
pnpm db:push

# 4. Seed with synthetic patient data (requires Java 11+)
pnpm db:seed

# 5. Generate auth tokens
pnpm create-tokens

# 6. Start the dev server
pnpm dev
```

The API will be available at [http://localhost:3001](http://localhost:3001), with interactive docs at [http://localhost:3001/docs](http://localhost:3001/docs).

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Local: `postgresql://postgres:postgres@localhost:5433/virtual_clinic` |
| `AZURE_OPENAI_ENDPOINT` | Yes | Azure OpenAI API endpoint URL |
| `AZURE_OPENAI_API_KEY` | Yes | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Yes | Azure OpenAI deployment/model name |
| `SUPABASE_JWT_SECRET` | Yes | Secret for JWT signing/verification (HS256) |

Optional variables for the seed script:

| Variable | Default | Description |
|----------|---------|-------------|
| `SYNTHEA_POPULATION` | `20` | Number of synthetic patients to generate |
| `SYNTHEA_SEED` | `42` | Random seed for reproducible output |
| `SYNTHEA_STATE` | `Massachusetts` | US state for patient generation |

## Database

### Local PostgreSQL (Docker)

```bash
pnpm db:up       # Start Postgres 17 container (port 5433)
pnpm db:down     # Stop the container
```

### Schema & Data

```bash
pnpm db:push     # Push Drizzle schema to the database
pnpm db:seed     # Generate Synthea patients and seed the database
pnpm db:reset    # Drop and recreate the public schema
pnpm db:studio   # Open Drizzle Studio (database GUI)
```

The seed script runs [Synthea](https://github.com/synthetichealth/synthea) to generate synthetic patient EHRs (conditions, medications, allergies, encounters, observations, procedures, immunizations, care plans), then inserts everything into the database. **Java 11+** must be installed.

### Schema Overview

**EHR tables** (9): `patients`, `encounters`, `conditions`, `medications`, `observations`, `allergies`, `procedures`, `immunizations`, `careplans`

**Conversation tables** (2): `conversations` (linked to a patient + task type), `messages` (role: system/user/assistant)

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | Public | Health check with database connectivity |
| `GET` | `/api/swagger` | Public | OpenAPI 3.1 specification (JSON) |
| `GET` | `/docs` | Public | Interactive API documentation (Scalar) |
| `GET` | `/api/patients` | Admin | List patients (paginated) |
| `GET` | `/api/patients/{id}` | Admin | Patient detail with full EHR summary |
| `GET` | `/api/conversations` | User | List conversations (paginated, filterable) |
| `POST` | `/api/conversations` | User | Create a conversation session |
| `GET` | `/api/conversations/{id}` | User | Get conversation with message history |
| `POST` | `/api/conversations/{id}/messages` | User | Send message, receive patient response |

### Task Types

| Type | Description |
|------|-------------|
| `diagnosis` | Interview the patient to determine their condition |
| `treatment` | Interview the patient to predict the treatment plan |
| `event` | Interview the patient to estimate probability of a clinical event |

## Authentication

The API uses **JWT bearer tokens** (HS256) in the `Authorization` header:

```
Authorization: Bearer <token>
```

Two roles:

- **User** tokens can access conversation endpoints
- **Admin** tokens can additionally access patient data endpoints

### Generating Tokens

```bash
pnpm create-tokens                           # 10 user + 1 admin, 7-day expiry
pnpm create-tokens --users 30 --admins 3     # Custom counts
pnpm create-tokens --expiry 14d              # Custom expiry
```

Tokens are written to `tokens.txt` (gitignored).

## Simulated Patient Agent

The agent role-plays as a real patient using their Synthea EHR data:

- Uses everyday language (says "my chest hurts", not "angina pectoris")
- Never reveals diagnoses directly — describes symptoms as a real patient would
- Shows realistic behavior: uncertainty, anxiety, forgetfulness about dates
- Answers conversationally, revealing details as asked rather than all at once
- Behavior adapts based on the task type (diagnosis, treatment, or event)

The full EHR is included in the system prompt as context.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev --turbopack --port 3001` | Dev server with hot reload |
| `build` | `next build` | Production build |
| `start` | `next start --port 3001` | Serve production build |
| `lint` | `next lint` | Run ESLint |
| `db:up` | `docker compose up -d` | Start Postgres container |
| `db:down` | `docker compose down` | Stop Postgres container |
| `db:push` | `drizzle-kit push` | Push schema to database |
| `db:seed` | `tsx scripts/seed.ts` | Generate + seed synthetic data |
| `db:reset` | `tsx scripts/reset.ts` | Drop and recreate schema |
| `db:generate` | `drizzle-kit generate` | Generate migration SQL files |
| `db:migrate` | `drizzle-kit migrate` | Run migrations |
| `db:studio` | `drizzle-kit studio` | Open Drizzle Studio GUI |
| `create-tokens` | `tsx scripts/create-tokens.ts` | Generate JWT tokens |

## Deployment

Deployed to [Vercel](https://vercel.com/) with [Supabase](https://supabase.com/) PostgreSQL in production. The messages endpoint has a 60-second max duration to accommodate LLM response times.
