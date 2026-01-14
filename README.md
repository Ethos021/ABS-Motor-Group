# ABS Motor Group

## Run with Docker

1. Install Docker and Docker Compose.
2. From the repository root run:
   ```bash
   docker compose up --build
   ```
3. The frontend is available at http://localhost:5173 and the API at http://localhost:4000/api.

The compose file starts:
- MySQL with the `abs_motor_group` database (user `abs_user` / `abs_password`).
- The backend service, which applies Prisma migrations and seeds demo data automatically.
- The frontend service, built with `VITE_API_URL=http://localhost:4000/api`.

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
