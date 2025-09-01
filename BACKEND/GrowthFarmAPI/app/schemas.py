from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# ========================
# User Schemas
# ========================

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: str = Field(default="farmer", pattern="^(farmer|guest|admin)$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: Optional[str] = Field(None, pattern="^(farmer|guest|admin)$")

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

# ========================
# Farm Schemas
# ========================

class FarmBase(BaseModel):
    farm_name: str = Field(..., min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    size_hectares: Optional[Decimal] = Field(None, ge=0)
    crop_type: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    farm_name: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    size_hectares: Optional[Decimal] = Field(None, ge=0)
    crop_type: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None

class FarmResponse(FarmBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Compatibility aliases for router
Farm = FarmResponse

# ========================
# Zone Schemas
# ========================

class ZoneBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    area: Optional[Decimal] = Field(None, ge=0)
    soil_type: Optional[str] = Field(None, max_length=100)

class ZoneCreate(ZoneBase):
    pass

class ZoneResponse(ZoneBase):
    id: int
    farm_id: int
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Compatibility alias
Zone = ZoneResponse

# ========================
# Dashboard Schemas  
# ========================

class FarmDashboardInfo(BaseModel):
    farm_id: int
    farm_name: str
    total_area: Optional[Decimal] = None
    active_zones: int = 0
    
class FarmStats(BaseModel):
    total_plantings: int = 0
    active_devices: int = 0
    recent_harvests: int = 0
    avg_soil_moisture: Optional[float] = None
    avg_temperature: Optional[float] = None
    
class FarmDashboard(BaseModel):
    farm_info: FarmDashboardInfo
    stats: FarmStats
    recent_sensor_data: List = []
    upcoming_tasks: List = []

# ========================
# Sensor Data Schemas
# ========================

class SensorDataBase(BaseModel):
    sensor_type: str = Field(..., pattern="^(temperature|humidity|soil_moisture|ph_level|light)$")
    value: Decimal
    unit: Optional[str] = Field(None, max_length=20)

class SensorDataCreate(SensorDataBase):
    farm_id: int

class SensorDataResponse(SensorDataBase):
    id: int
    farm_id: int
    recorded_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Weather Data Schemas
# ========================

class WeatherDataBase(BaseModel):
    temperature: Optional[Decimal] = None
    humidity: Optional[Decimal] = Field(None, ge=0, le=100)
    rainfall: Optional[Decimal] = Field(None, ge=0)
    wind_speed: Optional[Decimal] = Field(None, ge=0)
    weather_condition: Optional[str] = Field(None, max_length=50)

class WeatherDataCreate(WeatherDataBase):
    farm_id: int

class WeatherDataResponse(WeatherDataBase):
    id: int
    farm_id: int
    recorded_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Weather Forecast Schemas (for external API)
# ========================

class WeatherForecast(BaseModel):
    date: str
    temperature_c: int
    temperature_f: int
    summary: str

# ========================
# Marketplace Schemas
# ========================

class MarketplaceBase(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    quantity: int = Field(..., gt=0)
    unit: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=255)

class MarketplaceCreate(MarketplaceBase):
    pass

class MarketplaceUpdate(BaseModel):
    product_name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, gt=0)
    unit: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=255)
    is_available: Optional[bool] = None

class MarketplaceResponse(MarketplaceBase):
    id: int
    seller_id: int
    is_available: bool
    created_at: datetime
    updated_at: datetime
    seller: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# Compatibility aliases
MarketplaceProduct = MarketplaceResponse
Product = MarketplaceResponse
MarketplaceProductCreate = MarketplaceCreate

# ========================
# Notification Schemas
# ========================

class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1)
    type: Optional[str] = Field(None, max_length=50)

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# API Response Schemas
# ========================

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class HealthCheck(BaseModel):
    status: str
    database: str
    timestamp: str
    version: str = "1.0.0"

class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
    pages: int

# ========================
# Authentication Schemas
# ========================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
