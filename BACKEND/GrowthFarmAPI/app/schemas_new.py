from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from decimal import Decimal
from enum import Enum

# ========================
# Enums
# ========================

class UserRoleEnum(str, Enum):
    farmer = "farmer"
    guest = "guest"
    admin = "admin"
    buyer = "buyer"

class FarmTypeEnum(str, Enum):
    organic = "organic"
    conventional = "conventional"
    hydroponic = "hydroponic"
    greenhouse = "greenhouse"

class PlantingStatusEnum(str, Enum):
    planned = "planned"
    planted = "planted"
    growing = "growing"
    harvested = "harvested"
    failed = "failed"

class DeviceStatusEnum(str, Enum):
    online = "online"
    offline = "offline"
    maintenance = "maintenance"
    error = "error"

class OrderStatusEnum(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    shipping = "shipping"
    delivered = "delivered"
    completed = "completed"
    cancelled = "cancelled"
    refunded = "refunded"

# ========================
# User Schemas
# ========================

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    profile_image: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=255)
    role: UserRoleEnum = Field(default=UserRoleEnum.farmer)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    profile_image: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=255)
    role: Optional[UserRoleEnum] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    last_login: Optional[datetime]
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
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    address: Optional[str] = Field(None, max_length=500)
    latitude: Optional[Decimal] = Field(None, ge=-90, le=90)
    longitude: Optional[Decimal] = Field(None, ge=-180, le=180)
    total_area: Optional[Decimal] = Field(None, ge=0)
    farm_type: Optional[FarmTypeEnum] = None
    established_date: Optional[date] = None

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    address: Optional[str] = Field(None, max_length=500)
    latitude: Optional[Decimal] = Field(None, ge=-90, le=90)
    longitude: Optional[Decimal] = Field(None, ge=-180, le=180)
    total_area: Optional[Decimal] = Field(None, ge=0)
    farm_type: Optional[FarmTypeEnum] = None
    established_date: Optional[date] = None

class FarmResponse(FarmBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Farm Zone Schemas
# ========================

class FarmZoneBase(BaseModel):
    zone_name: str = Field(..., min_length=1, max_length=100)
    zone_code: str = Field(..., min_length=1, max_length=20)
    area_size: Optional[Decimal] = Field(None, ge=0)
    soil_type: Optional[str] = Field(None, max_length=100)
    irrigation_type: Optional[str] = Field(None, regex=r"^(drip|sprinkler|flood|manual)$")

class FarmZoneCreate(FarmZoneBase):
    pass

class FarmZoneResponse(FarmZoneBase):
    id: int
    farm_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Crop Schemas
# ========================

class CropBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    scientific_name: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    planting_season: Optional[str] = Field(None, max_length=100)
    harvest_time_days: Optional[int] = Field(None, ge=1, le=365)
    water_requirement: Optional[str] = Field(None, max_length=50)
    soil_type_preference: Optional[str] = Field(None, max_length=100)
    temperature_min: Optional[Decimal] = None
    temperature_max: Optional[Decimal] = None
    description: Optional[str] = None
    care_instructions: Optional[str] = None

class CropCreate(CropBase):
    pass

class CropResponse(CropBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Planting Schemas
# ========================

class PlantingBase(BaseModel):
    crop_id: int
    planting_date: date
    expected_harvest_date: Optional[date] = None
    quantity_planted: Optional[int] = Field(None, ge=0)
    status: PlantingStatusEnum = Field(default=PlantingStatusEnum.planned)
    notes: Optional[str] = None

class PlantingCreate(PlantingBase):
    pass

class PlantingUpdate(BaseModel):
    expected_harvest_date: Optional[date] = None
    actual_harvest_date: Optional[date] = None
    quantity_planted: Optional[int] = Field(None, ge=0)
    quantity_harvested: Optional[int] = Field(None, ge=0)
    status: Optional[PlantingStatusEnum] = None
    notes: Optional[str] = None

class PlantingResponse(PlantingBase):
    id: int
    farm_zone_id: int
    actual_harvest_date: Optional[date]
    quantity_harvested: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Marketplace Schemas
# ========================

class MarketplaceProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    quantity_available: int = Field(..., ge=0)
    minimum_order: int = Field(default=1, ge=1)
    unit: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, max_length=50)
    product_images: Optional[List[str]] = None
    harvest_date: Optional[date] = None
    expiry_date: Optional[date] = None
    organic_certified: bool = Field(default=False)

class MarketplaceProductCreate(MarketplaceProductBase):
    farm_id: Optional[int] = None
    planting_id: Optional[int] = None

class MarketplaceProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    quantity_available: Optional[int] = Field(None, ge=0)
    minimum_order: Optional[int] = Field(None, ge=1)
    unit: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, max_length=50)
    product_images: Optional[List[str]] = None
    harvest_date: Optional[date] = None
    expiry_date: Optional[date] = None
    organic_certified: Optional[bool] = None

class MarketplaceProductResponse(MarketplaceProductBase):
    id: int
    seller_id: int
    farm_id: Optional[int]
    planting_id: Optional[int]
    rating_average: Decimal
    total_reviews: int
    is_available: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Order Schemas
# ========================

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    unit_price: Decimal
    total_price: Decimal
    product_snapshot: Optional[Dict[str, Any]]
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_cost: Decimal = Field(default=0.00, ge=0)
    payment_method: str = Field(..., regex=r"^(cash|bank_transfer|credit_card|wallet)$")
    shipping_address: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = Field(..., min_items=1)

class OrderResponse(OrderBase):
    id: int
    buyer_id: int
    seller_id: int
    order_number: str
    total_amount: Decimal
    status: OrderStatusEnum
    payment_status: str
    delivery_date: Optional[date]
    created_at: datetime
    updated_at: datetime
    order_items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True

# ========================
# IoT Device Schemas
# ========================

class IoTDeviceBase(BaseModel):
    device_name: str = Field(..., min_length=1, max_length=255)
    device_type: str = Field(..., regex=r"^(sensor|camera|irrigation|lighting)$")
    device_id: str = Field(..., min_length=1, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    manufacturer: Optional[str] = Field(None, max_length=100)
    firmware_version: Optional[str] = Field(None, max_length=50)

class IoTDeviceCreate(IoTDeviceBase):
    farm_zone_id: int

class IoTDeviceResponse(IoTDeviceBase):
    id: int
    farm_zone_id: int
    status: DeviceStatusEnum
    last_online: Optional[datetime]
    installation_date: Optional[date]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Sensor Data Schemas
# ========================

class SensorDataBase(BaseModel):
    sensor_type: str = Field(..., regex=r"^(temperature|humidity|soil_moisture|ph_level|light)$")
    value: Decimal
    unit: Optional[str] = Field(None, max_length=20)
    quality_score: Optional[Decimal] = Field(None, ge=0, le=1)

class SensorDataCreate(SensorDataBase):
    device_id: int

class SensorDataResponse(SensorDataBase):
    id: int
    device_id: int
    recorded_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Weather Data Schemas
# ========================

class WeatherDataBase(BaseModel):
    latitude: Decimal = Field(..., ge=-90, le=90)
    longitude: Decimal = Field(..., ge=-180, le=180)
    temperature: Optional[Decimal] = None
    humidity: Optional[Decimal] = None
    rainfall: Optional[Decimal] = None
    wind_speed: Optional[Decimal] = None
    wind_direction: Optional[Decimal] = None
    pressure: Optional[Decimal] = None
    uv_index: Optional[Decimal] = None
    weather_condition: Optional[str] = Field(None, max_length=50)
    forecast_date: date
    is_forecast: bool = Field(default=False)
    data_source: Optional[str] = Field(None, max_length=50)

class WeatherDataCreate(WeatherDataBase):
    farm_id: Optional[int] = None

class WeatherDataResponse(WeatherDataBase):
    id: int
    farm_id: Optional[int]
    recorded_at: datetime
    
    class Config:
        from_attributes = True

# ========================
# Notification Schemas
# ========================

class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1)
    category: Optional[str] = Field(None, regex=r"^(system|weather|iot|marketplace|harvest|irrigation)$")
    notification_type: Optional[str] = Field(None, regex=r"^(info|warning|alert|success)$")
    action_url: Optional[str] = Field(None, max_length=500)
    priority: str = Field(default="medium", regex=r"^(low|medium|high|urgent)$")
    expires_at: Optional[datetime] = None

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
    data: Optional[Dict[str, Any]] = None

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int

# ========================
# Dashboard Schemas
# ========================

class FarmDashboardResponse(BaseModel):
    farm_info: Dict[str, Any]
    stats: Dict[str, Any]
    recent_activity: str
