# ABS Motor Group

## Run with Docker

1. Install Docker and Docker Compose.
2. Copy `.env.example` to `.env` and adjust values if needed.
3. From the repository root run:
   ```bash
   docker compose up --build
   ```
4. The frontend is available at http://localhost:5173 and the API at http://localhost:4000/api.

The compose file starts:
- MySQL with the `abs_motor_group` database (credentials come from `.env`).
- The backend service, which applies Prisma migrations and seeds demo data automatically via `docker-entrypoint.sh` (set `SKIP_SEED=true` to skip reseeding).
- The frontend service, built with `VITE_API_URL` from `.env`.

## Local development (without Docker)

- Backend: set `DATABASE_URL` and `CORS_ORIGIN` in `backend/.env`, then run:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  npm run dev -- --host --port 5173
  ```
Ensure the API is reachable at `VITE_API_URL` (default `http://localhost:4000/api`).
