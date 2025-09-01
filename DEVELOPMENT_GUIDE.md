# 👨‍💻 Development Guide - Growth Farm Project

คู่มือสำหรับนักพัฒนาที่ต้องการแก้ไขหรือต่อยอดโปรเจค Growth Farm

## 📂 โครงสร้างโปรเจคแบบละเอียด

```
Full_Growth_Farm/
├── BACKEND/                    # FastAPI Backend
│   └── GrowthFarmAPI/         # Main API application
│       ├── app/               # Application code
│       │   ├── main.py        # FastAPI app instance
│       │   ├── config.py      # Configuration settings
│       │   ├── database.py    # Database connection
│       │   ├── models.py      # SQLAlchemy models
│       │   ├── schemas.py     # Pydantic schemas
│       │   ├── auth/          # Authentication system
│       │   │   ├── router.py      # Auth endpoints
│       │   │   ├── service.py     # Auth business logic
│       │   │   ├── jwt_handler.py # JWT token handling
│       │   │   └── dependencies.py # Auth dependencies
│       │   ├── routers/       # API route modules
│       │   │   ├── farms.py       # Farm management
│       │   │   ├── marketplace.py # Marketplace features
│       │   │   ├── weather.py     # Weather integration
│       │   │   └── health.py      # Health check
│       │   └── gemini_ai/     # AI integration
│       │       ├── router.py      # AI endpoints
│       │       └── service.py     # AI business logic
│       ├── dev.bat            # Quick start script
│       ├── pyproject.toml     # Python project config
│       ├── requirements.txt   # Python dependencies
│       ├── .env              # Environment variables
│       └── .env.example      # Environment template
│
└── FRONTEND/                  # React Native Frontend
    └── GrowthFarmApp/         # Expo React Native app
        ├── app/               # App screens (Expo Router)
        │   ├── (auth)/        # Authentication screens
        │   └── (app)/         # Main app screens
        ├── components/        # Reusable UI components
        ├── src/               # Source code
        │   ├── services/      # API services
        │   ├── contexts/      # React contexts
        │   ├── config/        # App configuration
        │   └── utils/         # Utility functions
        ├── assets/            # Images, fonts, icons
        └── package.json       # Node.js dependencies
        ├── src/               # Source code
        │   ├── services/      # API services
        │   ├── contexts/      # React contexts
        │   └── config/        # Configuration
        ├── components/        # React components
        ├── package.json       # Dependencies
        ├── .env.example      # Environment template
        └── README.md         # Frontend docs
```

## Quick Start

### Backend Setup
```bash
# Navigate to backend
cd BACKEND/GrowthFarmAPI

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env
# Edit .env with your database credentials

# Run development server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend
cd FRONTEND/GrowthFarmApp

# Install dependencies
npm install

# Setup environment
copy .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

## VS Code Tasks

Use the pre-configured VS Code tasks:

- **Build**: `Ctrl+Shift+P` → "Tasks: Run Task" → "build"
- **Start API Server**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start API Server"
- **Start React Native Metro**: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start React Native Metro"

## Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/growth_farm
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
EXPO_PUBLIC_API_TIMEOUT=10000
```

## Database Setup

1. Install MySQL
2. Create database: `CREATE DATABASE growth_farm;`
3. Update DATABASE_URL in backend/.env
4. Run backend server (it will create tables automatically)

## Development Workflow

1. Start backend API server
2. Start frontend Metro bundler
3. Use Expo Go app to scan QR code (mobile testing)
4. Use web browser for web testing

## API Documentation

- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## Project Features

### Backend (FastAPI)
- User authentication with JWT
- Farm management system
- Marketplace functionality
- RESTful API design
- Automatic API documentation
- Database migrations

### Frontend (React Native/Expo)
- Cross-platform mobile app
- Authentication flow
- Farm dashboard
- Marketplace interface
- Real-time data updates
- Responsive design

## Troubleshooting

### Backend Issues
- Check Python virtual environment is activated
- Verify database connection in .env
- Ensure all dependencies installed: `pip install -r requirements.txt`

### Frontend Issues  
- Clear Metro cache: `npx expo start --clear`
- Reinstall node_modules: `rm -rf node_modules && npm install`
- Check API URL in .env matches backend server

### Common Problems
1. **Module not found**: Check imports and file paths
2. **Database connection**: Verify MySQL service and credentials
3. **CORS issues**: Backend includes CORS middleware
4. **Port conflicts**: Backend uses 8000, frontend uses 8081

## Next Steps

1. Configure production database
2. Add environment-specific configs
3. Implement additional features
4. Add comprehensive testing
5. Set up CI/CD pipeline
