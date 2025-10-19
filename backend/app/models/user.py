from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    age = Column(Integer)
    monthly_income = Column(Float, default=0.0)
    monthly_expenses = Column(Float, default=0.0)
    financial_goals = Column(JSON, default=[])
    risk_profile = Column(String, default="moderate")
    islamic_knowledge = Column(String, default="beginner")  # beginner, intermediate, advanced
    financial_values = Column(JSON, default=[])  # halal_only, social_impact, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_financial_update = Column(DateTime(timezone=True))
    
    # Additional fields for better financial tracking
    currency = Column(String, default="KZT")
    occupation = Column(String)
    family_size = Column(Integer, default=1)
    financial_priorities = Column(JSON, default=[])  # savings, investment, charity, etc.

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    risk_profile: Optional[str] = "moderate"
    islamic_knowledge: Optional[str] = "beginner"
    currency: Optional[str] = "KZT"
    occupation: Optional[str] = None
    family_size: Optional[int] = 1
    financial_priorities: Optional[List[str]] = []

    @validator('monthly_income', 'monthly_expenses')
    def validate_financial_values(cls, v):
        if v is not None and v < 0:
            raise ValueError('Financial values cannot be negative')
        return v

    @validator('risk_profile')
    def validate_risk_profile(cls, v):
        valid_profiles = ['conservative', 'moderate', 'aggressive']
        if v not in valid_profiles:
            raise ValueError(f'Risk profile must be one of: {valid_profiles}')
        return v

class UserUpdate(BaseModel):
    """Model for updating user financial data"""
    full_name: Optional[str] = None
    age: Optional[int] = None
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    risk_profile: Optional[str] = None
    islamic_knowledge: Optional[str] = None
    currency: Optional[str] = None
    occupation: Optional[str] = None
    family_size: Optional[int] = None
    financial_priorities: Optional[List[str]] = None
    financial_goals: Optional[List[Dict[str, Any]]] = None

    @validator('monthly_income', 'monthly_expenses')
    def validate_financial_values(cls, v):
        if v is not None and v < 0:
            raise ValueError('Financial values cannot be negative')
        return v

    @validator('risk_profile')
    def validate_risk_profile(cls, v):
        if v is not None:
            valid_profiles = ['conservative', 'moderate', 'aggressive']
            if v not in valid_profiles:
                raise ValueError(f'Risk profile must be one of: {valid_profiles}')
        return v

    @validator('islamic_knowledge')
    def validate_islamic_knowledge(cls, v):
        if v is not None:
            valid_levels = ['beginner', 'intermediate', 'advanced']
            if v not in valid_levels:
                raise ValueError(f'Islamic knowledge must be one of: {valid_levels}')
        return v

class UserFinancialUpdate(BaseModel):
    """Specific model for financial data updates from analysis page"""
    monthly_income: float
    monthly_expenses: float

    @validator('monthly_income', 'monthly_expenses')
    def validate_positive_values(cls, v):
        if v < 0:
            raise ValueError('Financial values must be positive')
        return v

    @validator('monthly_expenses')
    def validate_expenses_against_income(cls, v, values):
        if 'monthly_income' in values and v > values['monthly_income'] * 2:
            raise ValueError('Expenses seem unusually high compared to income')
        return v

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    age: Optional[int]
    monthly_income: Optional[float]
    monthly_expenses: Optional[float]
    risk_profile: str
    islamic_knowledge: str
    currency: str
    occupation: Optional[str]
    family_size: int
    financial_priorities: List[str]
    financial_goals: List[Dict[str, Any]]
    created_at: datetime
    updated_at: Optional[datetime]
    last_financial_update: Optional[datetime]

    class Config:
        from_attributes = True

class UserFinancialSummary(BaseModel):
    """Model for financial summary responses"""
    user_id: int
    monthly_income: float
    monthly_expenses: float
    monthly_savings: float
    savings_rate: float
    recommended_savings: float
    recommended_investment: float
    zakat_amount: float
    financial_health: str  # excellent, good, needs_improvement
    last_updated: datetime

    class Config:
        from_attributes = True

class UserProfileStats(BaseModel):
    """Model for user profile statistics"""
    total_goals: int
    active_goals: int
    completed_goals: int
    total_goal_amount: float
    saved_amount: float
    completion_rate: float
    average_monthly_savings: float
    financial_strength_score: int  # 0-100

# Additional models for financial calculations
class FinancialMetrics(BaseModel):
    """Model for calculated financial metrics"""
    monthly_income: float
    monthly_expenses: float
    monthly_savings: float
    savings_rate: float
    essential_spending: float
    discretionary_spending: float
    recommended_budget: Dict[str, float]
    islamic_finance_recommendations: List[str]
    financial_health_score: int

class BudgetRecommendation(BaseModel):
    """Model for budget recommendations based on Islamic principles"""
    category: str
    recommended_percentage: float
    recommended_amount: float
    current_amount: float
    difference: float
    advice: str

class IslamicFinanceCheck(BaseModel):
    """Model for Islamic finance compliance check"""
    is_compliant: bool
    issues: List[str]
    recommendations: List[str]
    zakat_eligible: bool
    zakat_amount: float