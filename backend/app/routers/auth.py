from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..models.user import User, UserCreate, UserResponse
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # In a real app, you would save to database
    # This is a simplified version
    hashed_password = get_password_hash(user_data.password)
    
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        age=user_data.age,
        monthly_income=user_data.monthly_income,
        risk_profile=user_data.risk_profile,
        islamic_knowledge=user_data.islamic_knowledge
    )
    
    # Mock response - in real app save to DB
    return UserResponse(
        id=1,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        age=user.age,
        monthly_income=user.monthly_income,
        risk_profile=user.risk_profile,
        islamic_knowledge=user.islamic_knowledge
    )

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock authentication - in real app check against database
    if form_data.username != "testuser" or form_data.password != "testpass":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}