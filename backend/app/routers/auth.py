from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt

from ..models.user import UserCreate, UserResponse
from ..core.config import settings
from ..core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Mock пользователь для тестирования
MOCK_USER = {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com", 
    "hashed_password": get_password_hash("testpass"),
    "full_name": "Test User",
    "age": 30,
    "monthly_income": 300000,
    "risk_profile": "moderate",
    "islamic_knowledge": "intermediate"
}

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Mock регистрация - в реальном приложении сохраняем в БД
    return UserResponse(
        id=1,
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        age=user_data.age,
        monthly_income=user_data.monthly_income,
        risk_profile=user_data.risk_profile,
        islamic_knowledge=user_data.islamic_knowledge
    )

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock аутентификация
    if form_data.username != MOCK_USER["username"] or not verify_password(form_data.password, MOCK_USER["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": MOCK_USER["id"],
        "username": MOCK_USER["username"]
    }