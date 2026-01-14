#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding demo data..."
npm run prisma:seed

echo "Starting API server..."
npm start
