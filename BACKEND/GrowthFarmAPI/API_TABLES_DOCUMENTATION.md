# 🌱 Growth Farm API - Tables Documentation

## Overview
This document provides comprehensive information about the Growth Farm API table endpoints. The API provides simple GET endpoints for all database tables without any conditions - returning all records from each table.

## Base URL
```
http://localhost:3000
```

## Authentication
Most table endpoints don't require authentication for basic read operations. However, for production use, implement proper authentication middleware.

## Table Endpoints

### 📊 Get All Tables Info
Get overview of all tables with record counts.

```http
GET /api/tables/all
```

**Response:**
```json
{
  "success": true,
  "message": "All table information retrieved successfully",
  "data": {
    "users": { "count": 5, "tableName": "users_GrowthFarm" },
    "farms": { "count": 3, "tableName": "farms_GrowthFarm" },
    "farmZones": { "count": 8, "tableName": "farm_zones_GrowthFarm" }
    // ... more tables
  },
  "totalTables": 16
}
```

### 👥 Users Table
Get all users (passwords excluded for security).

```http
GET /api/tables/users
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "username": "farmer01",
      "email": "farmer01@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "role": "FARMER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more users
  ]
}
```

### 🏡 Farms Table
Get all farms.

```http
GET /api/tables/farms
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "farmName": "Green Valley Farm",
      "farmType": "VEGETABLE",
      "location": "Chiang Mai, Thailand",
      "latitude": 18.7883,
      "longitude": 98.9853,
      "area": 15.5,
      "description": "Organic vegetable farm",
      "userId": 1,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more farms
  ]
}
```

### 🌾 Farm Zones Table
Get all farm zones.

```http
GET /api/tables/farm-zones
```

### 🛒 Marketplace Products Table
Get all marketplace products.

```http
GET /api/tables/marketplace-products
```

### 📦 Orders Table
Get all orders.

```http
GET /api/tables/orders
```

### 📝 Order Items Table
Get all order items.

```http
GET /api/tables/order-items
```

### 🔌 IoT Devices Table
Get all IoT devices.

```http
GET /api/tables/iot-devices
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": 1,
      "deviceName": "Temperature Sensor 01",
      "deviceType": "TEMPERATURE_SENSOR",
      "macAddress": "AA:BB:CC:DD:EE:FF",
      "ipAddress": "192.168.1.100",
      "status": "ACTIVE",
      "farmZoneId": 1,
      "lastPing": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more devices
  ]
}
```

### 📊 Sensor Data Table
Get all sensor data readings.

```http
GET /api/tables/sensor-data
```

### 🌱 Crops Table
Get all crops.

```http
GET /api/tables/crops
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "cropName": "Tomatoes",
      "variety": "Roma Tomatoes",
      "plantingDate": "2024-01-15",
      "harvestDate": "2024-04-15",
      "status": "GROWING",
      "farmZoneId": 1,
      "quantity": 500,
      "unit": "PLANTS",
      "notes": "Organic tomatoes",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more crops
  ]
}
```

### 📋 Activities Table
Get all activities.

```http
GET /api/tables/activities
```

### 🌤️ Weather Data Table
Get all weather data.

```http
GET /api/tables/weather-data
```

### 🤖 AI Conversations Table
Get all AI conversations.

```http
GET /api/tables/ai-conversations
```

### 🔔 Notifications Table
Get all notifications.

```http
GET /api/tables/notifications
```

### 📄 Reports Table
Get all reports.

```http
GET /api/tables/reports
```

### 👨‍💼 Team Members Table
Get all team members.

```http
GET /api/tables/team-members
```

### 💰 Financial Records Table
Get all financial records.

```http
GET /api/tables/financial-records
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "transactionType": "INCOME",
      "amount": 5000.00,
      "currency": "THB",
      "description": "Sale of tomatoes",
      "date": "2024-01-15",
      "category": "SALES",
      "farmId": 1,
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more financial records
  ]
}
```

## Standard Response Format

All endpoints return responses in the following format:

### Success Response
```json
{
  "success": true,
  "count": 10,
  "data": [
    // Array of table records
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to fetch [table name]",
  "error": "Detailed error message"
}
```

## HTTP Status Codes

- `200 OK` - Successful request
- `500 Internal Server Error` - Database or server error

## Testing the API

### Using the Test Script
```bash
# Install axios if not already installed
npm install axios

# Run the test script
node test-api.js

# Or test with custom URL
node test-api.js http://your-server:port
```

### Using curl
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test all tables info
curl http://localhost:3000/api/tables/all

# Test specific table
curl http://localhost:3000/api/tables/users
```

### Using Postman or Insomnia
1. Create a new request
2. Set method to GET
3. Enter the endpoint URL
4. Send the request

## Database Schema

All tables follow the naming convention: `[table_name]_GrowthFarm`

### Table Relationships
- **Users** → **Farms** (One-to-Many)
- **Farms** → **Farm Zones** (One-to-Many)  
- **Farm Zones** → **IoT Devices** (One-to-Many)
- **Farm Zones** → **Crops** (One-to-Many)
- **IoT Devices** → **Sensor Data** (One-to-Many)
- **Users** → **Orders** (One-to-Many)
- **Orders** → **Order Items** (One-to-Many)
- And more...

## Performance Notes

- All endpoints return data ordered by `createdAt DESC` (newest first)
- No pagination is implemented (for simple use case)
- For large datasets, consider implementing pagination
- Response times should be under 100ms for small datasets

## Security Considerations

- **Users endpoint** excludes password fields for security
- Implement rate limiting for production
- Add authentication middleware for sensitive data
- Consider field-level permissions for different user roles

## Error Handling

The API includes comprehensive error handling:
- Database connection errors
- Model validation errors  
- Sequelize query errors
- Network timeout errors

## Example Usage in Frontend

```javascript
// Fetch all farms
const response = await fetch('http://localhost:3000/api/tables/farms');
const farmData = await response.json();

if (farmData.success) {
  console.log(`Found ${farmData.count} farms:`, farmData.data);
} else {
  console.error('Error:', farmData.message);
}
```

## Support

For issues or questions:
1. Check the server logs
2. Verify database connection
3. Ensure all models are properly imported
4. Run the test script to identify specific issues

---

**Last Updated:** January 2024  
**API Version:** 1.0.0
