# ABS Motor Group

A modern web application for ABS Motor Group with a React frontend and Node.js/PostgreSQL backend.

## Quick Start with Docker 🐳

The easiest way to run the entire application (frontend + backend + database):

```bash
# Navigate to the root directory and start all services
docker compose up
```

Access the application at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

**Important**: Make sure to run `docker compose up` from the **root directory** of the project to start all services including the frontend. Running it from the `backend` directory will only start the backend and database.

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

## Project Structure

- `/` - React frontend (Vite + React)
- `/backend` - Node.js/Express backend with PostgreSQL

## Frontend

This is a Vite+React app with a modern UI built using:
- React 18
- React Router
- Tailwind CSS
- Radix UI components
- Base44 SDK (optional)

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
- PostgreSQL database
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

The PostgreSQL database includes:
- Users (authentication)
- Staff (staff members)
- Enquiries (customer enquiries)
- Calendar Blocks (availability)
- Bookings (appointments)

All entities include automatic timestamps and foreign key relationships.

## Development

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend (in a new terminal):
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`
4. Backend API at `http://localhost:3000`

## License

MIT