from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from .schemas import (
    ChatRequest, 
    ChatResponse, 
    WeatherAnalysisRequest,
    SensorAnalysisRequest,
    CropAdviceRequest,
    QuickQuestionRequest
)
from .service import gemini_service

router = APIRouter(prefix="/api/gemini", tags=["Gemini AI"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Chat with Gemini AI for farming assistance
    """
    try:
        # Generate AI response
        ai_response = await gemini_service.generate_response(
            request.message, 
            request.conversation_history
        )
        
        return ChatResponse(
            success=True,
            message="AI response generated successfully",
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI response: {str(e)}"
        )

@router.post("/weather-advice", response_model=ChatResponse)
async def get_weather_advice(request: WeatherAnalysisRequest):
    """
    Get farming advice based on weather conditions
    """
    try:
        weather_data = request.dict(exclude_none=True)
        ai_response = await gemini_service.get_weather_advice(weather_data)
        
        return ChatResponse(
            success=True,
            message="Weather advice generated successfully",
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate weather advice: {str(e)}"
        )

@router.post("/crop-advice", response_model=ChatResponse)
async def get_crop_advice(request: CropAdviceRequest):
    """
    Get advice for specific crop type and growth stage
    """
    try:
        ai_response = await gemini_service.get_crop_advice(
            request.crop_type,
            request.growth_stage
        )
        
        return ChatResponse(
            success=True,
            message="Crop advice generated successfully",
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate crop advice: {str(e)}"
        )

@router.post("/sensor-analysis", response_model=ChatResponse)
async def analyze_sensor_data(request: SensorAnalysisRequest):
    """
    Analyze IoT sensor data and provide recommendations
    """
    try:
        sensor_data = request.dict(exclude_none=True)
        ai_response = await gemini_service.analyze_sensor_data(sensor_data)
        
        return ChatResponse(
            success=True,
            message="Sensor analysis completed successfully",
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze sensor data: {str(e)}"
        )

@router.post("/quick-question", response_model=ChatResponse)
async def answer_quick_question(request: QuickQuestionRequest):
    """
    Get quick answers for common farming questions
    """
    try:
        ai_response = await gemini_service.get_quick_answer(request.question_type)
        
        return ChatResponse(
            success=True,
            message="Quick answer generated successfully",
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quick answer: {str(e)}"
        )

@router.get("/status")
async def get_ai_status():
    """
    Check Gemini AI service status
    """
    try:
        return {
            "status": "active",
            "service": "Gemini AI",
            "version": "gemini-pro",
            "endpoints": [
                "/api/gemini/chat",
                "/api/gemini/weather-advice", 
                "/api/gemini/crop-advice",
                "/api/gemini/sensor-analysis",
                "/api/gemini/quick-question"
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service unavailable: {str(e)}"
        )
