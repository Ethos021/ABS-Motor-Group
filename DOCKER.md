# Docker Setup Guide

This guide explains how to run the ABS Motor Group application using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

To run the entire application stack (frontend, backend, and database):

```bash
docker-compose up
```

To run in detached mode (background):

```bash
docker-compose up -d
```

The services will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## Services

The Docker setup includes three services:

### 1. PostgreSQL Database (`postgres`)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: abs_motor_group
- **User**: postgres
- **Password**: postgres (change in production!)
- **Data**: Persisted in a Docker volume

### 2. Backend API (`backend`)
- **Port**: 3000
- **Technology**: Node.js/Express
- **Features**: 
  - Automatic database migration on startup
  - JWT authentication
  - RESTful API endpoints

### 3. Frontend (`frontend`)
- **Port**: 80
- **Technology**: React/Vite with Nginx
- **Features**:
  - Production-optimized build
  - Gzip compression
  - Static asset caching

## Docker Commands

### Start all services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (WARNING: deletes database data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f
```

### Rebuild services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and start
docker-compose up --build
```

### Restart services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### View running services
```bash
docker-compose ps
```

### Execute commands in a running container
```bash
# Access backend shell
docker-compose exec backend sh

# Access database
docker-compose exec postgres psql -U postgres -d abs_motor_group

# Run migrations manually
docker-compose exec backend npm run migrate
```

## Development vs Production

### Development Mode

For development, you may want to use volume mounts to enable hot-reloading:

```yaml
# Add to docker-compose.yml under backend service
volumes:
  - ./backend:/app
  - /app/node_modules
```

### Production Mode

For production deployment:

1. **Change default credentials**:
   - Update `POSTGRES_PASSWORD` in docker-compose.yml
   - Update `JWT_SECRET` with a secure random value
   - Update `DB_PASSWORD` to match postgres password

2. **Use environment files**:
   ```bash
   # Create .env file
   POSTGRES_PASSWORD=your_secure_password
   JWT_SECRET=your_secure_jwt_secret
   ```

3. **Enable SSL/TLS**:
   - Configure reverse proxy (nginx/traefik)
   - Add SSL certificates

4. **Set up backups**:
   ```bash
   # Backup database
   docker-compose exec postgres pg_dump -U postgres abs_motor_group > backup.sql
   
   # Restore database
   docker-compose exec -T postgres psql -U postgres abs_motor_group < backup.sql
   ```

## Networking

All services are connected via the `abs-network` bridge network. Services can communicate using their service names:

- Backend connects to database at `postgres:5432`
- Frontend can call backend at `backend:3000`

## Data Persistence

Database data is persisted in a Docker volume named `postgres_data`. This ensures data survives container restarts.

To backup the volume:
```bash
docker run --rm -v abs-motor-group_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

To restore the volume:
```bash
docker run --rm -v abs-motor-group_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Troubleshooting

### Port already in use
If you get a port conflict error:

```bash
# Check what's using the port
lsof -i :80    # For frontend
lsof -i :3000  # For backend
lsof -i :5432  # For postgres

# Stop the conflicting service or change the port in docker-compose.yml
```

### Database connection issues
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Manually test connection
docker-compose exec backend sh
# Inside container:
nc -zv postgres 5432
```

### Frontend not loading
```bash
# Check frontend logs
docker-compose logs frontend

# Verify build completed successfully
docker-compose build frontend

# Check if backend is accessible
curl http://localhost:3000/health
```

### Permission issues
```bash
# Fix permissions on volumes
docker-compose down
sudo chown -R $USER:$USER postgres_data
docker-compose up
```

### Rebuild from scratch
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose rm -f
docker rmi abs-motor-group_backend abs-motor-group_frontend

# Rebuild and start
docker-compose up --build
```

## Environment Variables

You can override environment variables using a `.env` file in the root directory:

```env
# Database
POSTGRES_DB=abs_motor_group
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Backend
PORT=3000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost
```

Then reference them in docker-compose.yml:
```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

## Health Checks

The PostgreSQL service includes a health check. The backend service waits for postgres to be healthy before starting.

To check service health:
```bash
docker-compose ps
```

## Security Notes

**Important**: Change the following before deploying to production:

1. ✅ `POSTGRES_PASSWORD` - Use a strong password
2. ✅ `JWT_SECRET` - Use a cryptographically secure random string
3. ✅ `CORS_ORIGIN` - Set to your actual frontend domain
4. ✅ Enable HTTPS/SSL
5. ✅ Use secrets management (Docker Secrets, Kubernetes Secrets, etc.)
6. ✅ Set up firewall rules
7. ✅ Regular security updates

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Verify services are running: `docker-compose ps`
3. Check the main [README.md](./README.md) for application details
4. Review [backend documentation](./backend/README.md) for API details
