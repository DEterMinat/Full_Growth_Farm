from pydantic import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost/growthfarm"
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 30
    
    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:19006",
        "exp://192.168.1.100:8081"  # Expo development
    ]
    
    # Weather API
    WEATHER_API_KEY: Optional[str] = None
    WEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"
    
    # Google Maps
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_FOLDER: str = "uploads/"
    
    # Email Settings
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # Redis
    REDIS_URL: Optional[str] = None
    
    # Environment
    ENV: str = "development"
    DEBUG: bool = True
    
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "GrowthFarm API"
    PROJECT_DESCRIPTION: str = "Smart Farming Management System"
    VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
