# Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client (allow self-signed certs during build)
RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p /tmp/uploads

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
