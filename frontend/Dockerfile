# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Expose the Vite preview port
EXPOSE 5173

# Serve the built assets
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
