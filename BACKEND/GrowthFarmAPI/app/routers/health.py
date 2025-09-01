from fastapi import APIRouter
from datetime import datetime
from ..schemas import HealthCheck
from ..database import test_connection

router = APIRouter(tags=["Health"])

@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Growth Farm API is running!",
        "version": "1.0.0",
        "database": "MySQL Connected",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "weather": "/api/weather",
            "farms": "/api/farms",
            "marketplace": "/api/marketplace",
            "gemini": "/api/gemini"
        }
    }

@router.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint with database connection test"""
    try:
        db_status = test_connection()
        return HealthCheck(
            status="healthy",
            database="connected" if db_status else "disconnected",
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        return HealthCheck(
            status="unhealthy",
            database="error",
            timestamp=datetime.now().isoformat()
        )
