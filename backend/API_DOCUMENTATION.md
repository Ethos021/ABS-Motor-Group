# ABS Motor Group API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Enquiry Entity

### Enquiry Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| enquiry_type | string | Yes | One of: vehicle_interest, test_drive, finance, trade_in, general, sell_vehicle |
| firstName | string | Yes | Customer first name |
| lastName | string | Yes | Customer last name |
| email | string | Yes | Customer email |
| mobile | string | No | Customer phone number |
| message | text | No | Customer message |
| hasTradein | boolean | No | Whether customer has trade-in |
| tradeInYear | string | No | Trade-in vehicle year |
| tradeInMake | string | No | Trade-in vehicle make |
| tradeInModel | string | No | Trade-in vehicle model |
| tradeInOdometer | integer | No | Trade-in odometer reading |
| wantsFinance | boolean | No | Customer wants finance |
| wantsTestDrive | boolean | No | Customer wants test drive |
| vehicleId | UUID | No | Vehicle of interest ID |
| vehicleDetails | text | No | Vehicle details text |
| vehiclePrice | decimal | No | Vehicle price |
| vehicleSnapshot | JSON | No | Vehicle snapshot data |
| financeEstimate | JSON | No | Finance estimate data |
| preferredContactMethod | string | No | One of: phone, email, whatsapp |
| preferredContactTime | string | No | Preferred contact time |
| utmSource | string | No | UTM source tracking |
| utmMedium | string | No | UTM medium tracking |
| utmCampaign | string | No | UTM campaign tracking |
| referrer | text | No | HTTP referrer |
| pageUrl | text | No | Page URL |
| ipAddress | string | No | Customer IP address |
| status | string | No | One of: new, contacted, qualified, appointment_set, lost, closed_won, closed_lost |
| priority | string | No | One of: low, medium, high, urgent |
| assignedStaffId | UUID | No | Assigned staff member ID |
| contactedAt | timestamp | No | When customer was contacted |
| closedAt | timestamp | No | When enquiry was closed |
| internalNotes | text | No | Internal staff notes |

### Create Enquiry
**POST** `/enquiries`

Public endpoint - no authentication required.

**Request Body:**
```json
{
  "enquiry_type": "vehicle_interest",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobile": "0412345678",
  "message": "Interested in sedan models",
  "vehicleDetails": "2023 Toyota Camry",
  "vehiclePrice": 35000,
  "wantsTestDrive": true,
  "wantsFinance": true,
  "preferredContactMethod": "email"
}
```

### List Enquiries
**GET** `/enquiries`

Requires authentication.

**Query Parameters:**
- `status` - Filter by status
- `enquiry_type` - Filter by type
- `assignedStaffId` - Filter by assigned staff
- `limit` - Limit results
- `offset` - Pagination offset

**Example:**
```
GET /enquiries?status=new&limit=10
```

### Get Enquiry by ID
**GET** `/enquiries/:id`

Requires authentication.

### Search Enquiries
**GET** `/enquiries/search?q=term`

Search enquiries by name, email, phone, message, or vehicle details.

Requires authentication.

### Update Enquiry
**PUT** `/enquiries/:id`

Requires authentication.

**Request Body:**
```json
{
  "status": "contacted",
  "assignedStaffId": "staff-uuid-here",
  "internalNotes": "Called customer, scheduled test drive"
}
```

### Delete Enquiry
**DELETE** `/enquiries/:id`

Requires authentication.

---

## Staff Entity

### Staff Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| full_name | string | Yes | Staff member full name |
| email | string | Yes | Staff member email (unique) |
| phone | string | No | Staff member phone |
| role | string | Yes | One of: Sales, Finance, Manager, Service Advisor |
| is_active | boolean | No | Whether staff is active (default: true) |
| availability_hours | JSON | No | Staff availability schedule |

### Create Staff
**POST** `/staff`

Requires authentication.

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "email": "jane@absmotorgroup.com",
  "phone": "0412345678",
  "role": "Sales",
  "is_active": true
}
```

### List Staff
**GET** `/staff`

**Query Parameters:**
- `role` - Filter by role
- `is_active` - Filter by active status (true/false)

### Get Staff by ID
**GET** `/staff/:id`

### Update Staff
**PUT** `/staff/:id`

### Delete Staff
**DELETE** `/staff/:id`

---

## Calendar Block Entity

### Calendar Block Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Block title |
| start_datetime | timestamp | Yes | Start date/time |
| end_datetime | timestamp | Yes | End date/time |
| is_recurring | boolean | No | Whether block recurs |
| recurrence_pattern | string | No | One of: daily, weekly, monthly, yearly |
| recurrence_end_date | timestamp | No | When recurrence ends |
| block_type | string | Yes | One of: holiday, meeting, maintenance, training, other |
| staff_id | UUID | No | Associated staff member |
| notes | text | No | Block notes |
| is_active | boolean | No | Whether block is active |

### Create Calendar Block
**POST** `/calendar-blocks`

**Request Body:**
```json
{
  "title": "Christmas Holiday",
  "start_datetime": "2024-12-25T00:00:00Z",
  "end_datetime": "2024-12-26T23:59:59Z",
  "block_type": "holiday",
  "is_active": true
}
```

### List Calendar Blocks
**GET** `/calendar-blocks`

**Query Parameters:**
- `staff_id` - Filter by staff
- `block_type` - Filter by type
- `is_active` - Filter by active status
- `start_date` - Filter from date
- `end_date` - Filter to date

### Get Blocks by Date Range
**GET** `/calendar-blocks/date-range`

**Query Parameters:**
- `start_date` (required) - Start date
- `end_date` (required) - End date
- `staff_id` - Optional staff filter

### Get Calendar Block by ID
**GET** `/calendar-blocks/:id`

### Update Calendar Block
**PUT** `/calendar-blocks/:id`

### Delete Calendar Block
**DELETE** `/calendar-blocks/:id`

---

## Booking Entity

### Booking Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| enquiry_id | UUID | No | Related enquiry |
| booking_type | string | Yes | One of: test_drive, inspection, finance_meeting, delivery, consultation |
| scheduled_datetime | timestamp | Yes | Booking date/time |
| duration_minutes | integer | No | Duration (default: 30) |
| staff_id | UUID | No | Assigned staff |
| vehicle_id | UUID | No | Vehicle for booking |
| vehicle_snapshot | JSON | No | Vehicle snapshot |
| customer_name | string | Yes | Customer name |
| customer_email | string | No | Customer email |
| customer_phone | string | No | Customer phone |
| status | string | No | One of: pending, confirmed, completed, cancelled, no_show |
| confirmation_sent | boolean | No | Confirmation sent flag |
| reminder_sent | boolean | No | Reminder sent flag |
| notes | text | No | Booking notes |
| customer_notes | text | No | Customer notes |
| cancellation_reason | text | No | Cancellation reason |
| cancelled_at | timestamp | No | Cancellation timestamp |

### Create Booking
**POST** `/bookings`

Public endpoint - no authentication required.

**Request Body:**
```json
{
  "booking_type": "test_drive",
  "scheduled_datetime": "2024-01-15T14:00:00Z",
  "duration_minutes": 60,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "0412345678",
  "vehicle_id": "vehicle-uuid",
  "notes": "Interested in hybrid model"
}
```

### List Bookings
**GET** `/bookings`

**Query Parameters:**
- `status` - Filter by status
- `booking_type` - Filter by type
- `staff_id` - Filter by staff
- `enquiry_id` - Filter by enquiry
- `limit` - Limit results

### Get Bookings by Date Range
**GET** `/bookings/date-range`

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)
- `staff_id` - Optional filter

### Get Booking by ID
**GET** `/bookings/:id`

### Update Booking
**PUT** `/bookings/:id`

**Request Body:**
```json
{
  "status": "confirmed",
  "confirmation_sent": true,
  "staff_id": "staff-uuid"
}
```

### Delete Booking
**DELETE** `/bookings/:id`

---

## Authentication

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Current User
**GET** `/auth/me`

Requires authentication.

### List Users (Admin Only)
**GET** `/auth/users`

Requires admin authentication.

### Update User (Admin Only)
**PUT** `/auth/users/:id`

Requires admin authentication.

### Delete User (Admin Only)
**DELETE** `/auth/users/:id`

Requires admin authentication.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting in production.

## CORS

CORS is configured via the `CORS_ORIGIN` environment variable. By default, all origins are allowed in development.
