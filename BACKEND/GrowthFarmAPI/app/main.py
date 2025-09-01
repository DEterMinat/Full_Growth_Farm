from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import our modules
from .database import create_tables
from . import models
from .auth.router import router as auth_router
from .routers import health, weather, farms, marketplace
from .gemini_ai.router import router as gemini_router

# Create FastAPI instance
app = FastAPI(
    title="Growth Farm API",
    description="A FastAPI backend for Growth Farm management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(health.router)
app.include_router(weather.router)
app.include_router(gemini_router)
app.include_router(farms.router)
app.include_router(marketplace.router)

# Initialize database tables
create_tables()

# Run the application
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
