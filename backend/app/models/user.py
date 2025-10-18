from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel
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

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    monthly_income: Optional[float] = None
    risk_profile: Optional[str] = "moderate"
    islamic_knowledge: Optional[str] = "beginner"

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    age: Optional[int]
    monthly_income: Optional[float]
    risk_profile: str
    islamic_knowledge: str
    
    class Config:
        from_attributes = True