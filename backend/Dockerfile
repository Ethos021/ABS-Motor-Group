# Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Build the TypeScript source
RUN npm run build

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Create uploads directory
RUN mkdir -p /tmp/uploads

# Expose port
EXPOSE 4000

# Start command
CMD ["./docker-entrypoint.sh"]
