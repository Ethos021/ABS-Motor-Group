# API Documentation

Base URL: `http://localhost:3000/api`

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in via `/api/auth/login`.

## Endpoints

### Health Check

#### GET /api/health
Check API status and database connection.

**Response:**
```json
{
  "success": true,
  "message": "ABS Motor Group API is running",
  "timestamp": "2026-01-13T10:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "jwt-token"
  }
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "admin@absmotorgroup.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@absmotorgroup.com",
      "role": "admin"
    },
    "token": "jwt-token"
  }
}
```

### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@absmotorgroup.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

---

## Vehicle Endpoints

### GET /api/vehicles
Get all vehicles (public).

**Query Parameters:**
- `status` - Filter by status (available, sold, reserved, pending)
- `make` - Filter by make
- `model` - Filter by model (partial match)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minYear` - Minimum year
- `maxYear` - Maximum year
- `sortBy` - Sort field (createdAt, price, year, mileage, -createdAt for desc)

**Example:**
```
GET /api/vehicles?make=Toyota&minPrice=20000&maxPrice=50000&sortBy=-year
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "price": "32000.00",
      "mileage": 15000,
      "bodyType": "Sedan",
      "fuelType": "Petrol",
      "transmission": "Automatic",
      "color": "Silver",
      "status": "available",
      "isFeatured": true,
      "createdAt": "2026-01-13T10:00:00.000Z"
    }
  ]
}
```

### GET /api/vehicles/:id
Get a specific vehicle by ID (public).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "make": "Toyota",
    "model": "Camry",
    "year": 2022,
    "price": "32000.00",
    "description": "Well-maintained vehicle...",
    "features": "[\"Bluetooth\",\"Cruise Control\"]",
    "images": "[\"image1.jpg\",\"image2.jpg\"]",
    "viewCount": 42,
    "enquiries": [ ... ],
    "bookings": [ ... ]
  }
}
```

### POST /api/vehicles
Create a new vehicle (admin/staff only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "make": "Honda",
  "model": "Civic",
  "year": 2023,
  "price": 28000,
  "mileage": 5000,
  "bodyType": "Sedan",
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "color": "Blue",
  "engineSize": "2.0L",
  "doors": 4,
  "seats": 5,
  "description": "Like new...",
  "status": "available"
}
```

### PUT /api/vehicles/:id
Update a vehicle (admin/staff only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (partial update supported)
```json
{
  "price": 27000,
  "status": "sold"
}
```

### DELETE /api/vehicles/:id
Delete a vehicle (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

### POST /api/vehicles/import/csv
Import vehicles from CSV file (admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: CSV file

**Response:**
```json
{
  "success": true,
  "message": "Imported 10 vehicles, 2 failed",
  "data": {
    "imported": 10,
    "failed": 2,
    "vehicles": [ ... ],
    "errors": [ ... ]
  }
}
```

### GET /api/vehicles/export/csv
Export all vehicles to CSV (public).

**Response:** CSV file download

---

## Enquiry Endpoints

### POST /api/enquiries
Create a new enquiry (public).

**Request Body:**
```json
{
  "enquiryType": "vehicle",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobile": "0400123456",
  "message": "Interested in the Toyota Camry",
  "vehicleId": "vehicle-uuid"
}
```

### GET /api/enquiries
Get all enquiries (admin/staff only).

**Query Parameters:**
- `status` - Filter by status
- `enquiryType` - Filter by type
- `assignedTo` - Filter by assigned staff
- `sortBy` - Sort field

### GET /api/enquiries/:id
Get specific enquiry (admin/staff only).

### PUT /api/enquiries/:id
Update enquiry (admin/staff only).

### DELETE /api/enquiries/:id
Delete enquiry (admin only).

---

## Booking Endpoints

### POST /api/bookings
Create a new booking (public).

**Request Body:**
```json
{
  "bookingType": "test_drive",
  "scheduledDatetime": "2026-01-20T14:00:00Z",
  "customerName": "John Doe",
  "customerPhone": "0400123456",
  "customerEmail": "john@example.com",
  "vehicleId": "vehicle-uuid",
  "notes": "Prefer morning slot"
}
```

### GET /api/bookings
Get all bookings (admin/staff only).

**Query Parameters:**
- `status` - Filter by status
- `bookingType` - Filter by type
- `staffId` - Filter by staff member
- `date` - Filter by date (YYYY-MM-DD)
- `sortBy` - Sort field

### GET /api/bookings/:id
Get specific booking (admin/staff only).

### PUT /api/bookings/:id
Update booking (admin/staff only).

### DELETE /api/bookings/:id
Delete booking (admin only).

---

## Staff Endpoints

### GET /api/staff
Get all staff members (public).

**Query Parameters:**
- `isActive` - Filter by active status (true/false)
- `department` - Filter by department

### GET /api/staff/:id
Get specific staff member (public).

### POST /api/staff
Create staff member (admin only).

### PUT /api/staff/:id
Update staff member (admin only).

### DELETE /api/staff/:id
Delete staff member (admin only).

---

## Calendar Block Endpoints

### GET /api/calendar-blocks
Get calendar blocks (admin/staff only).

**Query Parameters:**
- `staffId` - Filter by staff member
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `blockType` - Filter by type

### POST /api/calendar-blocks
Create calendar block (admin/staff only).

**Request Body:**
```json
{
  "staffId": "staff-uuid",
  "blockType": "holiday",
  "title": "Annual Leave",
  "startTime": "2026-01-20T00:00:00Z",
  "endTime": "2026-01-27T23:59:59Z",
  "isAllDay": true
}
```

### PUT /api/calendar-blocks/:id
Update calendar block (admin/staff only).

### DELETE /api/calendar-blocks/:id
Delete calendar block (admin/staff only).

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate entry) |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## Rate Limiting

- 100 requests per 15-minute window per IP
- Returns 429 status when exceeded
- Limit resets after window expires

## CORS

Only requests from `http://localhost:8081` are allowed by default.
Configure `CORS_ORIGIN` environment variable for production.
