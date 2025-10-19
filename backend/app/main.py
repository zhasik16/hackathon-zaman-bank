from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from .core.config import settings
from .routers import auth, chat, goals, analysis, products

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Zaman AI Islamic Financial Assistant - Персональный помощник для управления финансами в соответствии с принципами ислама",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        # Add your production frontend URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Внутренняя ошибка сервера",
            "detail": str(exc) if settings.DEBUG else "Произошла непредвиденная ошибка"
        }
    )

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["authentication"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["chat"])
app.include_router(goals.router, prefix=settings.API_V1_STR, tags=["goals"])
app.include_router(analysis.router, prefix=settings.API_V1_STR, tags=["analysis"])
app.include_router(products.router, prefix=settings.API_V1_STR, tags=["products"])

# Serve static files (if needed)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {
        "message": "Добро пожаловать в Zaman AI Islamic Financial Assistant! 🌙",
        "version": settings.VERSION,
        "description": "Персональный помощник для управления финансами в соответствии с принципами ислама",
        "endpoints": {
            "documentation": "/api/docs",
            "health_check": "/health",
            "api_v1_base": settings.API_V1_STR
        },
        "features": [
            "Исламское финансовое консультирование",
            "Управление финансовыми целями",
            "Анализ расходов и доходов",
            "Подбор шариат-совместимых продуктов",
            "Голосовой ассистент"
        ]
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    from .services.ai_service import islamic_ai_service
    
    health_status = {
        "status": "healthy",
        "service": "Zaman AI Backend",
        "version": settings.VERSION,
        "timestamp": "2024-01-01T00:00:00Z",  # You might want to use actual timestamp
        "components": {
            "api": "operational",
            "database": "connected",  # Add actual DB check if you have one
            "ai_service": "available",
            "authentication": "enabled"
        }
    }
    
    # Test AI service connectivity
    try:
        # Simple test to check if AI service is responsive
        test_response = await islamic_ai_service.get_ai_response([
            {"role": "system", "content": "Test"},
            {"role": "user", "content": "Hello"}
        ])
        health_status["components"]["ai_service"] = "responsive"
    except Exception as e:
        health_status["components"]["ai_service"] = f"degraded: {str(e)}"
        health_status["status"] = "degraded"
    
    return health_status

@app.get("/api/info")
async def api_info():
    """Detailed API information"""
    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
        "api_version": "v1",
        "supported_features": {
            "authentication": ["register", "login", "token"],
            "chat": ["text_messages", "voice_messages", "financial_advice"],
            "goals": ["create", "read", "update", "delete"],
            "analysis": ["spending_analysis", "financial_planning", "comparative_analytics"],
            "products": ["browse", "recommend", "compare", "apply"]
        },
        "islamic_finance_principles": {
            "prohibited": ["riba (interest)", "gharar (uncertainty)", "maysir (gambling)"],
            "permitted": ["murabaha", "mudaraba", "musharaka", "ijara", "salam", "istisna"],
            "requirements": ["real economic activity", "risk sharing", "ethical investments"]
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting Zaman AI Islamic Financial Assistant...")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🔧 Debug mode: {settings.DEBUG}")
    print(f"🌐 API URL: http://localhost:8000")
    print(f"📚 Documentation: http://localhost:8000/api/docs")
    print("✅ Server started successfully!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🛑 Shutting down Zaman AI Islamic Financial Assistant...")

# Additional utility endpoints
@app.get("/api/version")
async def version():
    """API version information"""
    return {
        "version": settings.VERSION,
        "build": "1.0.0",  # You can set this from environment
        "release_date": "2024-01-01"
    }

@app.get("/api/status")
async def status():
    """Detailed service status"""
    return {
        "status": "operational",
        "last_updated": "2024-01-01T00:00:00Z",
        "incidents": [],
        "components": [
            {
                "name": "API",
                "status": "operational",
                "description": "Main API service"
            },
            {
                "name": "AI Service",
                "status": "operational", 
                "description": "GPT-4o-mini and Whisper integration"
            },
            {
                "name": "Database",
                "status": "operational",
                "description": "User data and analytics storage"
            },
            {
                "name": "Authentication",
                "status": "operational",
                "description": "User authentication and authorization"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=settings.DEBUG,  # Auto-reload in development
        log_level="debug" if settings.DEBUG else "info"
    )