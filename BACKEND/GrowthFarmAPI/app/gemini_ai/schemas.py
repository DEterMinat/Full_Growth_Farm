from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    """Chat message model"""
    id: Optional[int] = None
    type: str = Field(..., pattern="^(user|bot)$")
    text: str = Field(..., min_length=1)
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    """Request model for chat"""
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    """Response model for chat"""
    success: bool
    message: str
    response: str
    timestamp: str

class WeatherAnalysisRequest(BaseModel):
    """Request model for weather analysis"""
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None
    condition: Optional[str] = None

class SensorAnalysisRequest(BaseModel):
    """Request model for sensor data analysis"""
    soil_moisture: Optional[float] = None
    ph_level: Optional[float] = None
    light_intensity: Optional[float] = None
    soil_temperature: Optional[float] = None

class CropAdviceRequest(BaseModel):
    """Request model for crop advice"""
    crop_type: str = Field(..., min_length=1)
    growth_stage: Optional[str] = None

class QuickQuestionRequest(BaseModel):
    """Request model for quick questions"""
    question_type: str = Field(..., min_length=1)
