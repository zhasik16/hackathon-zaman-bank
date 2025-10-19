from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Dict, Any

from ..models.user import UserCreate, UserResponse, UserUpdate, UserFinancialUpdate, UserFinancialSummary
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
    "monthly_income": 500000.0,
    "monthly_expenses": 350000.0,
    "risk_profile": "moderate",
    "islamic_knowledge": "intermediate",
    "currency": "KZT",
    "occupation": "Software Developer",
    "family_size": 3,
    "financial_priorities": ["savings", "investment", "charity"],
    "financial_goals": [],
    "created_at": datetime.now(),
    "updated_at": datetime.now(),
    "last_financial_update": datetime.now()
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
        monthly_expenses=user_data.monthly_expenses or (user_data.monthly_income * 0.7 if user_data.monthly_income else 0),
        risk_profile=user_data.risk_profile,
        islamic_knowledge=user_data.islamic_knowledge,
        currency=user_data.currency,
        occupation=user_data.occupation,
        family_size=user_data.family_size,
        financial_priorities=user_data.financial_priorities,
        financial_goals=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        last_financial_update=datetime.now()
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
        data={"sub": form_data.username, "user_id": MOCK_USER["id"]}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": MOCK_USER["id"],
        "username": MOCK_USER["username"],
        "full_name": MOCK_USER["full_name"]
    }

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(update_data: UserUpdate, user_id: int = 1):
    """Update user profile with comprehensive data"""
    try:
        # Update mock user data
        updated_fields = update_data.dict(exclude_unset=True)
        
        # Update timestamps
        updated_fields["updated_at"] = datetime.now()
        if 'monthly_income' in updated_fields or 'monthly_expenses' in updated_fields:
            updated_fields["last_financial_update"] = datetime.now()
        
        MOCK_USER.update(updated_fields)
        
        return UserResponse(**MOCK_USER)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating profile: {str(e)}"
        )

@router.put("/financial-data", response_model=UserFinancialSummary)
async def update_financial_data(financial_data: UserFinancialUpdate, user_id: int = 1):
    """Update only financial data (income/expenses) from analysis page"""
    try:
        # Update financial data
        MOCK_USER.update({
            "monthly_income": financial_data.monthly_income,
            "monthly_expenses": financial_data.monthly_expenses,
            "updated_at": datetime.now(),
            "last_financial_update": datetime.now()
        })
        
        # Calculate financial summary
        monthly_savings = financial_data.monthly_income - financial_data.monthly_expenses
        savings_rate = monthly_savings / financial_data.monthly_income if financial_data.monthly_income > 0 else 0
        
        # Determine financial health
        if savings_rate >= 0.2:
            financial_health = "excellent"
        elif savings_rate >= 0.1:
            financial_health = "good"
        else:
            financial_health = "needs_improvement"
        
        return UserFinancialSummary(
            user_id=user_id,
            monthly_income=financial_data.monthly_income,
            monthly_expenses=financial_data.monthly_expenses,
            monthly_savings=monthly_savings,
            savings_rate=savings_rate,
            recommended_savings=financial_data.monthly_income * 0.2,
            recommended_investment=financial_data.monthly_income * 0.15,
            zakat_amount=financial_data.monthly_income * 0.025,
            financial_health=financial_health,
            last_updated=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating financial data: {str(e)}"
        )

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(user_id: int = 1):
    """Get current user profile"""
    return UserResponse(**MOCK_USER)

@router.get("/financial-summary", response_model=UserFinancialSummary)
async def get_financial_summary(user_id: int = 1):
    """Get user financial summary"""
    monthly_savings = MOCK_USER["monthly_income"] - MOCK_USER["monthly_expenses"]
    savings_rate = monthly_savings / MOCK_USER["monthly_income"] if MOCK_USER["monthly_income"] > 0 else 0
    
    # Determine financial health
    if savings_rate >= 0.2:
        financial_health = "excellent"
    elif savings_rate >= 0.1:
        financial_health = "good"
    else:
        financial_health = "needs_improvement"
    
    return UserFinancialSummary(
        user_id=user_id,
        monthly_income=MOCK_USER["monthly_income"],
        monthly_expenses=MOCK_USER["monthly_expenses"],
        monthly_savings=monthly_savings,
        savings_rate=savings_rate,
        recommended_savings=MOCK_USER["monthly_income"] * 0.2,
        recommended_investment=MOCK_USER["monthly_income"] * 0.15,
        zakat_amount=MOCK_USER["monthly_income"] * 0.025,
        financial_health=financial_health,
        last_updated=MOCK_USER["last_financial_update"] or datetime.now()
    )