#!/bin/sh
set -e

npx prisma migrate deploy
npm run prisma:seed
npm start
