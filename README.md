# ABS Motor Group

A modern web application for ABS Motor Group with a React frontend and Node.js/MySQL backend.

## Quick Start with Docker 🐳

The easiest way to run the entire application (frontend + backend + database):

```bash
# Navigate to the root directory and start all services
docker compose up
```

Access the application at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: localhost:3306

**Important**: Make sure to run `docker compose up` from the **root directory** of the project to start all services including the frontend. Running it from the `backend` directory will only start the backend and database.

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

## Project Structure

- `/` - React frontend (Vite + React)
- `/backend` - Node.js/Express backend with MySQL

## Frontend

This is a Vite+React app with a modern UI built using:
- React 18
- React Router
- Tailwind CSS
- Radix UI components

### Running the Frontend

```bash
npm install
npm run dev
```

### Building the Frontend

```bash
npm run build
```

## Backend

The backend is a RESTful API built with:
- Node.js + Express
- MySQL database
- JWT authentication
- Comprehensive entity management

### Backend Features

- **User Authentication**: JWT-based auth with role-based access control
- **Enquiry Management**: Track customer enquiries
- **Staff Management**: Manage staff members
- **Calendar Blocks**: Handle staff availability
- **Booking System**: Manage appointments and test drives

### Running the Backend

See the [backend README](./backend/README.md) for detailed instructions.

Quick start:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm start
```

For backend-only Docker setup (no frontend):
```bash
cd backend
docker compose up
```

**Note**: The `backend/docker-compose.yml` only starts the backend and database. For running the **complete application** (frontend + backend + database), use `docker compose up` from the **root directory**. See [DOCKER.md](./DOCKER.md) for details.

## API Documentation

See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for complete API reference.

## Database Schema

The MySQL database includes:
- Users (authentication)
- Staff (staff members)
- Enquiries (customer enquiries)
- Calendar Blocks (availability)
- Bookings (appointments)

All entities include automatic timestamps and foreign key relationships.

## Development

### Option 1: Local Development (Frontend via npm, Backend via Docker) - **Recommended**

This is the recommended approach for active development as it provides hot-reloading for the frontend while keeping the backend and database in Docker.

1. **Start the backend and database with Docker**:
   ```bash
   # From root directory
   docker compose -f docker-compose.dev.yml up
   
   # OR from backend directory
   cd backend
   docker compose up
   ```

2. **Start the frontend locally** (in a new terminal):
   ```bash
   # From root directory
   npm install
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - phpMyAdmin: http://localhost:8081

The frontend dev server is configured to proxy API requests to the backend running in Docker, so everything works seamlessly.

### Option 2: Full Local Development (No Docker)

1. **Start the backend locally**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run migrate
   npm run dev
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   # From root directory
   npm install
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

**Note**: You'll need MySQL installed and running locally for this option.

## License

MIT
