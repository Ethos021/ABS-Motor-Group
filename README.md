# ABS Motor Group - Full Stack Application

A complete production-ready JavaScript full-stack application for ABS Motor Group dealership, featuring a React frontend, Node.js/Express backend, MySQL database, and fully Dockerized environment.

## 🚀 Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Radix UI Components
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 5
- **ORM**: Prisma
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs, rate-limiting
- **Validation**: express-validator

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Admin**: phpMyAdmin
- **Process Manager**: Nodemon (development)

## 📋 Features

### Core Functionality
- ✅ Vehicle inventory management (with CSV import/export)
- ✅ Customer enquiry system
- ✅ Booking and appointment scheduling
- ✅ Staff management
- ✅ Calendar blocking system
- ✅ User authentication & authorization (JWT)
- ✅ Role-based access control (Admin, Staff, User)

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ SQL injection protection (Prisma ORM)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers

## 🏗️ Architecture

```
ABS-Motor-Group/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Seed data
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   ├── Dockerfile             # Backend Docker image
│   └── package.json
├── src/                       # React frontend source
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Frontend Docker image
├── nginx.conf                 # Nginx configuration
└── README.md

```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Git

### One-Command Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ABS-Motor-Group
```

2. **Start backend & database (Docker)**
```bash
docker compose up --build backend mysql phpmyadmin
```

This will:
- Build the backend and database containers
- Initialize the MySQL database
- Run migrations
- Seed initial data
- Start backend API and phpMyAdmin

3. **Start the frontend (npm dev)**
```bash
npm install
npm run dev
```

Need the production-style frontend container? Run:
```bash
docker compose --profile production up frontend
```
Stop the npm dev server first to avoid port conflicts.

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend (npm dev)** | http://localhost:8081 | - |
| **Backend API** | http://localhost:3000 | - |
| **phpMyAdmin** | http://localhost:8080 | User: `abs_user`<br>Password: `abs_password` |
| **Health Check** | http://localhost:3000/api/health | - |

### Default User Credentials

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@absmotorgroup.com | admin123 |
| Staff | staff@absmotorgroup.com | staff123 |

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/profile       # Get user profile (protected)
```

### Vehicles
```
GET    /api/vehicles           # Get all vehicles
GET    /api/vehicles/:id       # Get vehicle by ID
POST   /api/vehicles           # Create vehicle (admin/staff)
PUT    /api/vehicles/:id       # Update vehicle (admin/staff)
DELETE /api/vehicles/:id       # Delete vehicle (admin)
POST   /api/vehicles/import/csv # Import vehicles from CSV (admin)
GET    /api/vehicles/export/csv # Export vehicles to CSV
```

### Enquiries
```
GET    /api/enquiries          # Get all enquiries (admin/staff)
GET    /api/enquiries/:id      # Get enquiry by ID (admin/staff)
POST   /api/enquiries          # Create enquiry (public)
PUT    /api/enquiries/:id      # Update enquiry (admin/staff)
DELETE /api/enquiries/:id      # Delete enquiry (admin)
```

### Bookings
```
GET    /api/bookings           # Get all bookings (admin/staff)
GET    /api/bookings/:id       # Get booking by ID (admin/staff)
POST   /api/bookings           # Create booking (public)
PUT    /api/bookings/:id       # Update booking (admin/staff)
DELETE /api/bookings/:id       # Delete booking (admin)
```

### Staff
```
GET    /api/staff              # Get all staff (public)
GET    /api/staff/:id          # Get staff by ID (public)
POST   /api/staff              # Create staff (admin)
PUT    /api/staff/:id          # Update staff (admin)
DELETE /api/staff/:id          # Delete staff (admin)
```

### Calendar Blocks
```
GET    /api/calendar-blocks    # Get all blocks (admin/staff)
GET    /api/calendar-blocks/:id # Get block by ID (admin/staff)
POST   /api/calendar-blocks    # Create block (admin/staff)
PUT    /api/calendar-blocks/:id # Update block (admin/staff)
DELETE /api/calendar-blocks/:id # Delete block (admin/staff)
```

## 🗄️ Database Schema

### Main Tables
- `users` - User accounts with authentication
- `vehicles` - Vehicle inventory
- `enquiries` - Customer enquiries
- `bookings` - Appointments and bookings
- `staff` - Staff members
- `calendar_blocks` - Staff calendar blocks

All tables include:
- Primary keys (UUID)
- Foreign key relationships
- Indexes for performance
- `created_at` and `updated_at` timestamps

## 🔧 Development

### Local Development (without Docker)

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local database credentials
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### Frontend Setup
```bash
npm install
npm run dev
```

### Database Management

#### View Database in Prisma Studio
```bash
cd backend
npx prisma studio
```

#### Create a Migration
```bash
cd backend
npx prisma migrate dev --name migration_name
```

#### Reset Database
```bash
cd backend
npm run db:reset
```

### CSV Import/Export for Vehicles

The application supports CSV import/export for vehicle management.

#### CSV Format for Import
```csv
make,model,year,price,mileage,bodyType,fuelType,transmission,color,engineSize,doors,seats,vin,registrationNo,description,features,images,status,isFeatured
Toyota,Camry,2022,32000,15000,Sedan,Petrol,Automatic,Silver,2.5L,4,5,VIN123,ABC123,Description here,Bluetooth|Cruise Control,image1.jpg|image2.jpg,available,true
```

#### Upload CSV via API
```bash
curl -X POST http://localhost:3000/api/vehicles/import/csv \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@vehicles.csv"
```

#### Export CSV
```bash
curl http://localhost:3000/api/vehicles/export/csv -o vehicles.csv
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://abs_user:abs_password@mysql:3306/abs_motor_group"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8081,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐳 Docker Commands

### Start services
```bash
docker compose up
```

### Start in detached mode
```bash
docker compose up -d
```

### Rebuild containers
```bash
docker compose up --build
```

### Stop services
```bash
docker compose down
```

### Stop and remove volumes (⚠️ deletes database)
```bash
docker compose down -v
```

### View logs
```bash
docker compose logs -f
docker compose logs backend
docker compose logs frontend
```

### Access container shell
```bash
docker exec -it abs-backend sh
docker exec -it abs-mysql mysql -u abs_user -p
```

## 📊 Database Access (phpMyAdmin)

1. Open http://localhost:8080
2. Login with:
   - **Server**: mysql
   - **Username**: abs_user
   - **Password**: abs_password
3. Browse tables, run queries, and manage the database

## 🛡️ Security Best Practices

✅ **Implemented:**
- JWT authentication with secure secret keys
- Password hashing using bcrypt
- Input validation and sanitization
- SQL injection protection via Prisma ORM
- XSS protection
- Rate limiting
- CORS configuration
- Security headers via Helmet
- No secrets in source control

⚠️ **For Production:**
- Change all default passwords
- Use strong JWT secrets (generate with `openssl rand -base64 32`)
- Enable HTTPS
- Set appropriate CORS origins
- Configure firewall rules
- Use environment-specific configurations
- Enable database backups
- Monitor logs and errors

## 🧪 Testing API with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@absmotorgroup.com",
    "password": "admin123"
  }'
```

### Get Vehicles (Public)
```bash
curl http://localhost:3000/api/vehicles
```

### Create Enquiry (Public)
```bash
curl -X POST http://localhost:3000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "enquiryType": "vehicle",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobile": "0400123456",
    "message": "Interested in the Toyota Camry"
  }'
```

## 📝 Notes

- The backend waits for MySQL to be ready before starting (health check with retries)
- Prisma migrations run automatically on container startup
- Database is seeded with sample data on first run
- MySQL data persists in a named Docker volume
- Frontend is served via Nginx for production-ready performance
- All API responses follow a consistent format:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for ABS Motor Group.

## 📧 Support

For support, contact: app@base44.com

---

**Built with ❤️ using JavaScript only - No PHP, Python, or other backend languages!**
