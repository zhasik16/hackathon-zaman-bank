from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routers import auth, chat, goals, analysis  # Теперь analysis должен импортироваться

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Zaman AI Islamic Financial Assistant - Персональный помощник для управления финансами в соответствии с принципами ислама"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(goals.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)  # Теперь этот роутер существует

@app.get("/")
async def root():
    return {
        "message": "Добро пожаловать в Zaman AI Islamic Financial Assistant!",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Zaman AI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)