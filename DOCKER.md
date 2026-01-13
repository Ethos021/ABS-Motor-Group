# Docker Setup Guide

This guide explains how to run the ABS Motor Group application using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Development Setup (Recommended)

For active development, it's recommended to run the frontend locally with hot-reloading while keeping the backend and database in Docker. This provides the best development experience.

### Frontend via npm run dev, Backend via Docker

1. **Start the backend and database**:
   ```bash
   # From root directory
   docker compose -f docker-compose.dev.yml up
   
   # OR from backend directory
   cd backend
   docker compose up
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   # From root directory
   npm install
   npm run dev
   ```

The services will be available at:
- **Frontend (with hot-reload)**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306
- **phpMyAdmin**: http://localhost:8081

The frontend dev server automatically proxies API requests to the backend running in Docker at `http://localhost:3000`, so no additional configuration is needed.

### Benefits of this approach:
- ✅ Fast frontend hot-reloading for rapid UI development
- ✅ Backend and database in isolated Docker environment
- ✅ No need to install MySQL locally
- ✅ Consistent backend environment across team
- ✅ Easy database management via phpMyAdmin

## Production Setup (All Services in Docker)

To run the entire application stack exactly as it would run in production:

```bash
# Navigate to the root directory
cd /path/to/ABS-Motor-Group

# Start all services
docker compose up
```

To run in detached mode (background):

```bash
docker compose up -d
```

**Note**: In development mode (using `docker-compose.dev.yml`), the frontend is not included in Docker. Instead, you run it locally with `npm run dev` for hot-reloading capabilities.

The services will be available at:
- **Frontend**: http://localhost:8080 (via Nginx in production, via Vite dev server in development)
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306
- **phpMyAdmin**: http://localhost:8081

## Services

The Docker setup includes four services:

### 1. MySQL Database (`mysql`)
- **Image**: mysql:8.0
- **Port**: 3306
- **Database**: abs_motor_group
- **Root Password**: mysql (change in production!)
- **User**: abs_user
- **Password**: mysql (change in production!)
- **Data**: Persisted in a Docker volume

### 2. phpMyAdmin (`phpmyadmin`)
- **Image**: phpmyadmin:5.2
- **Port**: 8081
- **Access**: http://localhost:8081
- **Purpose**: Web-based MySQL database management interface
- **Login**: Use root/mysql or abs_user/mysql credentials

### 3. Backend API (`backend`)
- **Port**: 3000
- **Technology**: Node.js/Express
- **Features**: 
  - Automatic database migration on startup
  - JWT authentication
  - RESTful API endpoints

### 4. Frontend (`frontend`)
- **Port**: 8080
- **Technology**: React/Vite with Nginx (in production mode)
- **Features**:
  - Production-optimized build
  - Gzip compression
  - Static asset caching

**Note**: In development mode (using `docker-compose.dev.yml`), the frontend is not included in Docker. Instead, you run it locally with `npm run dev` for hot-reloading capabilities.

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
docker-compose logs mysql
docker-compose logs phpmyadmin

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

# Access database via MySQL CLI
docker-compose exec mysql mysql -u root -pmysql abs_motor_group

# Or access database via phpMyAdmin
# Open http://localhost:8081 in your browser

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
   - Update `MYSQL_ROOT_PASSWORD` in docker-compose.yml
   - Update `JWT_SECRET` with a secure random value
   - Update `MYSQL_PASSWORD` and `MYSQL_USER` as needed
   - Update phpMyAdmin credentials accordingly

2. **Use environment files**:
   ```bash
   # Create .env file
   MYSQL_ROOT_PASSWORD=your_secure_password
   JWT_SECRET=your_secure_jwt_secret
   ```

3. **Enable SSL/TLS**:
   - Configure reverse proxy (nginx/traefik)
   - Add SSL certificates

4. **Set up backups**:
   ```bash
   # Backup database
   docker-compose exec mysql mysqldump -u root -pmysql abs_motor_group > backup.sql
   
   # Restore database
   docker-compose exec -T mysql mysql -u root -pmysql abs_motor_group < backup.sql
   ```

## Networking

All services are connected via the `abs-network` bridge network. Services can communicate using their service names:

- Backend connects to database at `mysql:3306`
- phpMyAdmin connects to database at `mysql:3306`
- Frontend can call backend at `backend:3000`

## Data Persistence

Database data is persisted in a Docker volume named `mysql_data`. This ensures data survives container restarts.

To backup the volume:
```bash
docker run --rm -v abs-motor-group_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .
```

To restore the volume:
```bash
docker run --rm -v abs-motor-group_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql_backup.tar.gz -C /data
```

## Troubleshooting

### Port already in use
If you get a port conflict error:

```bash
# Check what's using the port
lsof -i :8080  # For frontend
lsof -i :8081  # For phpMyAdmin
lsof -i :3000  # For backend
lsof -i :3306  # For mysql

# Stop the conflicting service or change the port in docker-compose.yml
```

### Database connection issues
```bash
# Check if mysql is healthy
docker-compose ps

# View mysql logs
docker-compose logs mysql

# Manually test connection
docker-compose exec backend sh
# Inside container:
nc -zv mysql 3306

# Or use phpMyAdmin to verify database connectivity
# Open http://localhost:8081 in browser
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
sudo chown -R $USER:$USER mysql_data
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
MYSQL_DATABASE=abs_motor_group
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_USER=abs_user
MYSQL_PASSWORD=your_secure_password

# Backend
PORT=3000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080
```

Then reference them in docker-compose.yml:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
```

## Health Checks

The MySQL service includes a health check. The backend service and phpMyAdmin wait for MySQL to be healthy before starting.

To check service health:
```bash
docker-compose ps
```

## Security Notes

**Important**: Change the following before deploying to production:

1. ✅ `MYSQL_ROOT_PASSWORD` - Use a strong password
2. ✅ `MYSQL_PASSWORD` - Use a strong password
3. ✅ `JWT_SECRET` - Use a cryptographically secure random string
4. ✅ `CORS_ORIGIN` - Set to your actual frontend domain
5. ✅ Enable HTTPS/SSL
6. ✅ Use secrets management (Docker Secrets, Kubernetes Secrets, etc.)
7. ✅ Set up firewall rules
8. ✅ Regular security updates
9. ✅ Disable or secure phpMyAdmin in production (consider removing or restricting access)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [phpMyAdmin Docker Image](https://hub.docker.com/_/phpmyadmin)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Verify services are running: `docker-compose ps`
3. Check the main [README.md](./README.md) for application details
4. Review [backend documentation](./backend/README.md) for API details
