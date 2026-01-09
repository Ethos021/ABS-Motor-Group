# ABS Motor Group Backend API

A RESTful API backend for the ABS Motor Group website, built with Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Enquiry Management**: Track customer enquiries with full details
- **Staff Management**: Manage staff members and their roles
- **Calendar Blocks**: Handle staff availability and calendar blocking
- **Booking System**: Manage test drives, inspections, and appointments
- **PostgreSQL Database**: Robust relational database with proper indexing

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

## Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ installed and running
- npm or yarn package manager

## Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=abs_motor_group
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Create the PostgreSQL database**:
   ```bash
   createdb abs_motor_group
   ```
   Or via psql:
   ```sql
   CREATE DATABASE abs_motor_group;
   ```

6. **Run database migrations**:
   ```bash
   npm run migrate
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires auth)
- `GET /api/auth/users` - List all users (admin only)
- `PUT /api/auth/users/:id` - Update user (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)

### Enquiries (`/api/enquiries`)

- `POST /api/enquiries` - Create new enquiry (public)
- `GET /api/enquiries` - List all enquiries (requires auth)
- `GET /api/enquiries/search?q=term` - Search enquiries (requires auth)
- `GET /api/enquiries/:id` - Get enquiry by ID (requires auth)
- `PUT /api/enquiries/:id` - Update enquiry (requires auth)
- `DELETE /api/enquiries/:id` - Delete enquiry (requires auth)

### Staff (`/api/staff`)

- `POST /api/staff` - Create new staff member (requires auth)
- `GET /api/staff` - List all staff (requires auth)
- `GET /api/staff/:id` - Get staff by ID (requires auth)
- `PUT /api/staff/:id` - Update staff (requires auth)
- `DELETE /api/staff/:id` - Delete staff (requires auth)

### Calendar Blocks (`/api/calendar-blocks`)

- `POST /api/calendar-blocks` - Create calendar block (requires auth)
- `GET /api/calendar-blocks` - List calendar blocks (requires auth)
- `GET /api/calendar-blocks/date-range?start_date=X&end_date=Y` - Get blocks by date range (requires auth)
- `GET /api/calendar-blocks/:id` - Get block by ID (requires auth)
- `PUT /api/calendar-blocks/:id` - Update block (requires auth)
- `DELETE /api/calendar-blocks/:id` - Delete block (requires auth)

### Bookings (`/api/bookings`)

- `POST /api/bookings` - Create booking (public)
- `GET /api/bookings` - List all bookings (requires auth)
- `GET /api/bookings/date-range?start_date=X&end_date=Y` - Get bookings by date range (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `PUT /api/bookings/:id` - Update booking (requires auth)
- `DELETE /api/bookings/:id` - Delete booking (requires auth)

### Health Check

- `GET /health` - Check API and database status

## Database Schema

### Users Table
- Authentication and user management
- Fields: id, full_name, email, password_hash, role, created_date, updated_date

### Staff Table
- Staff member information
- Fields: id, full_name, email, phone, role, is_active, availability_hours, created_date, updated_date

### Enquiries Table
- Customer enquiry tracking
- Fields: enquiry_type, firstName, lastName, mobile, email, message, hasTradein, tradeIn details, vehicle details, preferences, status, priority, tracking fields

### Calendar Blocks Table
- Staff calendar and availability
- Fields: title, start_datetime, end_datetime, is_recurring, recurrence_pattern, block_type, staff_id, notes, is_active

### Bookings Table
- Appointment and booking management
- Fields: enquiry_id, booking_type, scheduled_datetime, staff_id, vehicle_id, customer details, status, confirmation status

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Example Requests

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Create an Enquiry (Public)
```bash
curl -X POST http://localhost:3000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "enquiry_type": "vehicle_interest",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "mobile": "0412345678",
    "message": "Interested in a sedan",
    "vehicleDetails": "2023 Toyota Camry",
    "wantsTestDrive": true
  }'
```

### List Enquiries (Authenticated)
```bash
curl -X GET http://localhost:3000/api/enquiries \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Database Migrations

The initial schema migration creates all necessary tables, indexes, and triggers. To run migrations:

```bash
npm run migrate
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (admin/user)
- SQL injection protection via parameterized queries
- CORS configuration
- Environment variable protection

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── enquiryController.js
│   │   ├── staffController.js
│   │   ├── calendarBlockController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── run.js               # Migration runner
│   ├── models/
│   │   ├── User.js
│   │   ├── Enquiry.js
│   │   ├── Staff.js
│   │   ├── CalendarBlock.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── staffRoutes.js
│   │   ├── calendarBlockRoutes.js
│   │   └── bookingRoutes.js
│   └── server.js                # Main server file
├── .env.example
├── package.json
└── README.md
```

## Error Handling

All endpoints return JSON responses with the following structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Testing

Test the API using tools like:
- cURL (command line)
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name abs-backend
   ```
3. Set up a reverse proxy (nginx/Apache)
4. Enable SSL/TLS certificates
5. Configure firewall rules
6. Set up database backups
7. Use environment-specific .env files

## Support

For issues and questions, please contact the development team.

## License

MIT
