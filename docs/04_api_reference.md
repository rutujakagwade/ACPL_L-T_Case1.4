# API Reference

## Overview

The L&T Sales Tracker API is a RESTful service built with Express.js that provides endpoints for user management, journey tracking, expense management, and administrative functions.

## Base URL
- Development: `http://localhost:5000`
- Production: `https://api.lt-sales-tracker.com` (example)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

### Roles
- `user`: Regular sales team member
- `admin`: Administrative user
- `superadmin`: Super administrative user

## Error Responses

All endpoints may return these error status codes:

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal processing error |

Common error response format:
```json
{
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** (200 OK)
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### POST /api/auth/register
Complete user registration after invitation.

**Request Body:**
```json
{
  "token": "string",
  "password": "string",
  "name": "string"
}
```

**Response:** (201 Created)
```json
{
  "message": "Registration successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### User Management

#### GET /api/auth/me
Get current user profile.

**Authentication:** Required  
**Roles:** Any authenticated user

**Response:** (200 OK)
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "profile": {
    "phone": "string",
    "address": "string"
  }
}
```

#### PUT /api/auth/me
Update current user profile.

**Authentication:** Required  
**Roles:** Any authenticated user

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:** (200 OK)
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "profile": {
      "phone": "string",
      "address": "string"
    }
  }
}
```

### Journey Management

#### POST /api/journeys
Create a new journey record.

**Authentication:** Required  
**Roles:** user, admin

**Request Body:**
```json
{
  "startLocation": "string",
  "endLocation": "string",
  "purpose": "string",
  "expectedDuration": "number"
}
```

**Response:** (201 Created)
```json
{
  "id": "string",
  "startLocation": "string",
  "endLocation": "string",
  "purpose": "string",
  "expectedDuration": "number",
  "status": "pending",
  "createdAt": "string"
}
```

#### GET /api/journeys
Get list of journeys for current user.

**Authentication:** Required  
**Roles:** user, admin

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, completed)
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response:** (200 OK)
```json
{
  "journeys": [{
    "id": "string",
    "startLocation": "string",
    "endLocation": "string",
    "purpose": "string",
    "status": "string",
    "createdAt": "string"
  }],
  "pagination": {
    "total": "number",
    "page": "number",
    "pages": "number"
  }
}
```

### Expense Management

#### POST /api/expenses
Submit a new expense.

**Authentication:** Required  
**Roles:** user, admin

**Request Body (multipart/form-data):**
```
{
  "amount": "number",
  "category": "string",
  "description": "string",
  "date": "string",
  "receipt": "file"
}
```

**Response:** (201 Created)
```json
{
  "id": "string",
  "amount": "number",
  "category": "string",
  "description": "string",
  "receiptUrl": "string",
  "status": "pending",
  "createdAt": "string"
}
```

### Admin Operations

#### POST /api/admin/members
Create new team member (Admin only).

**Authentication:** Required  
**Roles:** admin

**Request Body:**
```json
{
  "email": "string",
  "role": "string",
  "department": "string"
}
```

**Response:** (201 Created)
```json
{
  "message": "Invitation sent successfully",
  "member": {
    "id": "string",
    "email": "string",
    "role": "string",
    "status": "invited"
  }
}
```

#### GET /api/admin/expenses
Get all expenses (Admin only).

**Authentication:** Required  
**Roles:** admin

**Query Parameters:**
- `status`: Filter by status
- `userId`: Filter by user
- `startDate`: Filter by date range
- `endDate`: Filter by date range
- `page`: Page number
- `limit`: Items per page

**Response:** (200 OK)
```json
{
  "expenses": [{
    "id": "string",
    "userId": "string",
    "amount": "number",
    "category": "string",
    "status": "string",
    "createdAt": "string"
  }],
  "pagination": {
    "total": "number",
    "page": "number",
    "pages": "number"
  }
}
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Journey (with token)
```bash
curl -X POST http://localhost:5000/api/journeys \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "startLocation": "Mumbai",
    "endLocation": "Pune",
    "purpose": "Client Meeting",
    "expectedDuration": 3
  }'
```

### Submit Expense (with file)
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer <token>" \
  -F "amount=1000" \
  -F "category=travel" \
  -F "description=Taxi fare" \
  -F "receipt=@/path/to/receipt.jpg"
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## API Versioning

Current version: v1 (implicit in URL)
Future versions will be explicitly versioned: `/api/v2/`

## Postman Collection

<!-- Import the [L&T Sales Tracker API Collection](docs/postman/lt-sales-tracker.postman_collection.json) for easy API testing. -->