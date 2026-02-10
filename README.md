## Task2 – Scalable REST API + Auth + RBAC + CRUD + Test UI

This repo contains a **versioned REST API** (`/api/v1`) implemented with Next.js Route Handlers + Prisma(Postgres), plus a **simple frontend UI** to test the APIs.

### Features

- **Auth**: registration/login with password hashing (bcrypt) + JWT
- **Secure JWT handling**: JWT stored in an **httpOnly cookie**
- **RBAC**: `USER` vs `ADMIN` (admin endpoint: `/api/v1/admin/users`)
- **CRUD**: `Task` entity (`/api/v1/tasks`)
- **Validation & error handling**: Zod + consistent `{ ok: boolean }` responses
- **API docs**: OpenAPI JSON at `/api/v1/openapi` + Swagger UI at `/docs`
- **Scalable structure**: clear `lib/` modules + versioned `api/v1/` routes

### Tech

- Next.js (App Router)
- Postgres + Prisma
- JWT via `jose`
- Validation via `zod`

## Getting Started

### 1) Configure environment

Create a `.env` based on `.env.example`:

```bash
copy .env.example .env
```

Set:

- `DATABASE_URL` (Postgres)
- `JWT_SECRET` (long random string)

### 2) Install dependencies

```bash
npm install
```

### 3) Run database migrations

```bash
npm run prisma:migrate
```

### 4) Start the app

```bash
npm run dev
```

Open:

- UI: `http://localhost:3000/`
- Swagger UI: `http://localhost:3000/docs`

### API Quick Test

- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Me: `GET /api/v1/auth/me`
- Tasks CRUD: `GET/POST /api/v1/tasks`, `GET/PATCH/DELETE /api/v1/tasks/:id`

### Notes on Roles

- Default role is `USER`.
- In **development only**, `/api/v1/auth/register` accepts an optional `"role": "ADMIN"` to create an admin for testing.

### Scalability Note (short)

- **API versioning** (`/api/v1`) supports non-breaking evolution via `/api/v2` etc.
- **Modular design**: auth/db/validation utilities are isolated under `app/lib/` so new modules can reuse them.
- **Scale-out readiness**:
  - Stateless API nodes (JWT) behind a load balancer
  - Shared Postgres DB (optionally read replicas)
  - Add Redis for rate limiting / caching hot reads
  - Add centralized logging/metrics (e.g., OpenTelemetry)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Task2
