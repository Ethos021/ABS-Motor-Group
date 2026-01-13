# Quick Start Guide

This guide will help you get the ABS Motor Group application up and running in minutes.

## Prerequisites

- Docker Desktop installed and running
- Git installed
- At least 4GB of free RAM

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ABS-Motor-Group
```

### 2. Start the Application

```bash
docker compose up --build
```

This single command will:
- Build all Docker images
- Start MySQL database
- Run database migrations
- Seed initial data
- Start the backend API
- Start the frontend application
- Start phpMyAdmin

**First build takes 5-10 minutes**. Subsequent starts are much faster.

### 3. Wait for Services

Watch the logs until you see:
```
abs-backend   | ✓ Database connected successfully
abs-backend   | Server running on port 3000
```

### 4. Access the Application

Open your browser and visit:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:8081 | Main website |
| **API Health** | http://localhost:3000/api/health | Check API status |
| **phpMyAdmin** | http://localhost:8080 | Database admin |

### 5. Login with Default Credentials

#### Admin Account
- Email: `admin@absmotorgroup.com`
- Password: `admin123`

#### Staff Account
- Email: `staff@absmotorgroup.com`
- Password: `staff123`

## Quick Tests

### Test the API

```bash
# Check API health
curl http://localhost:3000/api/health

# Get all vehicles (public)
curl http://localhost:3000/api/vehicles

# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@absmotorgroup.com","password":"admin123"}'
```

### Access phpMyAdmin

1. Go to http://localhost:8080
2. Login with:
   - Server: `mysql`
   - Username: `abs_user`
   - Password: `abs_password`
3. Browse the `abs_motor_group` database

## Stopping the Application

```bash
# Stop all containers
docker compose down

# Stop and remove all data (⚠️ deletes database)
docker compose down -v
```

## Common Issues

### Port Already in Use

If you see `port is already allocated`:

```bash
# Find what's using the port
lsof -i :8081  # or :3000, :8080
# Kill the process or change the port in docker-compose.yml
```

### Database Connection Failed

If backend can't connect to MySQL:

```bash
# Check if MySQL is healthy
docker compose ps

# View MySQL logs
docker compose logs mysql

# Restart just the backend
docker compose restart backend
```

### Frontend Shows Error

If frontend can't connect to backend:

1. Check backend is running: http://localhost:3000/api/health
2. Check browser console for CORS errors
3. Verify .env has `VITE_API_URL=http://localhost:3000/api`

## Development Mode

To run with hot-reload for development:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

Make sure to update `.env` files with local database URLs when running outside Docker.

## Next Steps

- **Browse Vehicles**: http://localhost:8081
- **Create Enquiry**: Fill out the contact form
- **Admin Panel**: Login and access admin features
- **Test CSV Import**: See README.md for CSV import examples

## Getting Help

- Check README.md for detailed documentation
- Check SECURITY.md for security information
- View logs: `docker compose logs -f`
- Check container status: `docker compose ps`

---

**That's it! You're ready to start developing.** 🚀
