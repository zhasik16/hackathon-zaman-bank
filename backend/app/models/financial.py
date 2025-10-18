from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

Base = declarative_base()

class FinancialGoal(Base):
    __tablename__ = "financial_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    goal_name = Column(String)
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    timeline_months = Column(Integer)
    category = Column(String)  # housing, education, hajj, marriage, business, other
    priority = Column(String)  # high, medium, low
    islamic_importance = Column(String)  # fard, sunnah, mustahabb, mubah
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    transaction_type = Column(String)  # income, expense
    is_halal = Column(Boolean, default=True)
    date = Column(DateTime(timezone=True), server_default=func.now())

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    user_message = Column(Text)
    ai_response = Column(Text)
    context = Column(JSON)  # Store user context for personalization
    message_type = Column(String)  # goal_planning, habit_advice, product_recommendation, stress_management
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Models
class FinancialGoalCreate(BaseModel):
    goal_name: str
    target_amount: float
    timeline_months: int
    category: str
    priority: str = "medium"
    islamic_importance: Optional[str] = "mubah"

class FinancialGoalResponse(BaseModel):
    id: int
    user_id: int
    goal_name: str
    target_amount: float
    current_amount: float
    timeline_months: int
    category: str
    priority: str
    islamic_importance: str
    monthly_saving: float
    progress_percentage: float
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str
    message_type: str = "text"
    context: Optional[Dict[str, Any]] = None

class AIResponse(BaseModel):
    response: str
    recommendations: List[str]
    suggested_products: List[Dict[str, Any]]
    monthly_plan: Optional[Dict[str, Any]] = None