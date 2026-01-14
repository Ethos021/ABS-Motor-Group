#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

if [ "${SKIP_SEED:-false}" != "true" ]; then
  echo "Seeding demo data..."
  npm run prisma:seed
else
  echo "Skipping seed data because SKIP_SEED is true"
fi

echo "Starting API server..."
npm start
