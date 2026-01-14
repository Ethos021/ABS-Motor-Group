import dotenv from "dotenv";

dotenv.config();

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: numberFromEnv(process.env.PORT, 4000),
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};

if (!env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[env] DATABASE_URL is not set. Prisma will fail to connect without it."
  );
}
