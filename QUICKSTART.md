# Quick Start Guide: Development Setup

This guide shows you how to run the frontend via `npm run dev` and the backend via Docker - the recommended development workflow.

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- npm installed

## Setup Instructions

### 1. Start Backend Services with Docker

From the project root directory, run:

```bash
# Using the development docker-compose file
docker compose -f docker-compose.dev.yml up

# OR from the backend directory
cd backend
docker compose up
```

This will start:
- **MySQL Database** on port 3306
- **phpMyAdmin** on port 8081 (http://localhost:8081)
- **Backend API** on port 3000 (http://localhost:3000)

Wait for all services to be healthy. You should see:
```
✔ Database connected successfully
✔ Backend listening on port 3000
```

### 2. Start Frontend Development Server

Open a new terminal and from the project root directory:

```bash
# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

The frontend will be available at **http://localhost:8080**

## How It Works

- The **frontend** runs locally with Vite's hot-reload for rapid development
- The **backend** and **database** run in isolated Docker containers
- Vite automatically proxies API requests from `http://localhost:8080/api/*` to the backend at `http://localhost:3000/api/*`
- No additional configuration needed - it just works!

## Accessing Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend (Dev) | http://localhost:8080 | React application with hot-reload |
| Backend API | http://localhost:3000 | REST API endpoints |
| phpMyAdmin | http://localhost:8081 | Database management interface |
| MySQL Database | localhost:3306 | Direct database access |

### phpMyAdmin Login
- **Username**: `root`
- **Password**: `mysql`

## Stopping Services

### Stop Frontend
Press `Ctrl+C` in the terminal running `npm run dev`

### Stop Backend & Database
```bash
# From root directory
docker compose -f docker-compose.dev.yml down

# OR from backend directory
cd backend
docker compose down
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Check what's using the ports
lsof -i :8080  # Frontend
lsof -i :3000  # Backend
lsof -i :3306  # MySQL
lsof -i :8081  # phpMyAdmin

# Stop the conflicting process or change ports in the config files
```

### Backend Not Connecting

1. Ensure Docker services are healthy:
   ```bash
   docker compose -f docker-compose.dev.yml ps
   ```

2. Check backend logs:
   ```bash
   docker compose -f docker-compose.dev.yml logs backend
   ```

3. Verify database is accessible:
   ```bash
   docker compose -f docker-compose.dev.yml logs mysql
   ```

### API Requests Failing

1. Check that the backend is running: http://localhost:3000/health
2. Verify proxy configuration in `vite.config.js`
3. Check browser console for CORS or network errors

## Benefits of This Setup

✅ **Fast frontend hot-reloading** - See changes instantly  
✅ **No local MySQL installation** needed  
✅ **Consistent backend environment** across team  
✅ **Easy database management** via phpMyAdmin  
✅ **Automatic API proxying** - No CORS issues  
✅ **Isolated services** - Clean development environment

## Next Steps

- Read [README.md](./README.md) for full project documentation
- Check [DOCKER.md](./DOCKER.md) for advanced Docker usage
- See [backend/README.md](./backend/README.md) for API documentation

---

**Happy Coding! 🚀**
