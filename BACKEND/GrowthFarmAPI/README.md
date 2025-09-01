# Growth Farm API Documentation

## 🌱 Growth Farm Backend API

A modern FastAPI backend for farm management with authentication, weather data, marketplace, and farm management features.

## 📁 Project Structure

```
BACKEND/
└── GrowthFarmAPI/
    ├── .env                     # Environment variables
    ├── requirements.txt         # Python dependencies
    └── app/
        ├── __init__.py
        ├── main.py             # FastAPI application entry point
        ├── database.py         # Database configuration
        ├── models.py           # SQLAlchemy ORM models
        ├── schemas.py          # Pydantic schemas
        ├── auth/               # Authentication module
        │   ├── __init__.py
        │   ├── router.py       # Auth endpoints
        │   ├── service.py      # Auth business logic
        │   ├── schemas.py      # Auth-specific schemas
        │   └── jwt_handler.py  # JWT token handling
        └── routers/            # API endpoint routers
            ├── __init__.py
            ├── health.py       # Health check endpoints
            ├── weather.py      # Weather forecast endpoints
            ├── farms.py        # Farm management endpoints
            └── marketplace.py  # Marketplace endpoints
```

## 🚀 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Health & Info
- `GET /` - API root information
- `GET /health` - Health check with database status

### Weather (`/api/weather`)
- `GET /api/weather/` - Get 5-day weather forecast

### Farms (`/api/farms`)
- `GET /api/farms/` - Get all farms
- `POST /api/farms/` - Create new farm (requires auth)

### Marketplace (`/api/marketplace`)
- `GET /api/marketplace/` - Get marketplace items
- `POST /api/marketplace/` - Create marketplace item (requires auth)

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:
- Include token in Authorization header: `Bearer <token>`
- Tokens expire in 30 minutes (configurable in .env)
- Protected endpoints require valid authentication

## 🗄️ Database

- **Database**: MySQL (hosted on Aiven Cloud)
- **ORM**: SQLAlchemy with legacy MySQL connector support
- **Models**: User, Farm, SensorData, WeatherData, Marketplace, Notification

## ⚙️ Environment Variables

```bash
# Database Configuration
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database

# JWT Configuration
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

## 🛠️ Development

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Update database and JWT settings

3. **Run the application**:
   ```bash
   python -m app.main
   ```

4. **Access API documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## 📚 Features

- ✅ **Modular Architecture**: Separated routers, services, and schemas
- ✅ **Authentication**: JWT-based user authentication
- ✅ **Database**: MySQL with SQLAlchemy ORM
- ✅ **Environment Configuration**: Secure environment variable management
- ✅ **API Documentation**: Auto-generated with FastAPI
- ✅ **CORS Support**: Cross-origin resource sharing enabled
- ✅ **Health Checks**: Database connectivity monitoring
- ✅ **Clean Code**: Organized file structure and separation of concerns

## 🔄 Next Steps

1. Implement farm management CRUD operations
2. Add marketplace functionality with image uploads
3. Integrate sensor data collection
4. Add real weather API integration
5. Implement notification system
6. Add user role-based permissions
7. Add API rate limiting and security headers


$env:PYTHONPATH="D:\GROWTH_FARM\BACKEND\GrowthFarmAPI"; D:/GROWTH_FARM/.venv/Scripts/python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000