from fastapi import APIRouter
from typing import List
from datetime import datetime, timedelta
import random
from ..schemas import WeatherForecast

router = APIRouter(prefix="/api/weather", tags=["Weather"])

# Sample data for weather
weather_summaries = [
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", 
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
]

@router.get("/", response_model=List[WeatherForecast])
async def get_weather_forecast():
    """Get weather forecast for the next 5 days"""
    forecasts = []
    for i in range(1, 6):
        date = (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
        temp_c = random.randint(-20, 55)
        temp_f = int(32 + (temp_c * 9/5))
        summary = random.choice(weather_summaries)
        
        forecasts.append(WeatherForecast(
            date=date,
            temperature_c=temp_c,
            temperature_f=temp_f,
            summary=summary
        ))
    
    return forecasts
