from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from ..models.financial import ChatMessage, AIResponse
from ..services.ai_service import islamic_ai_service

router = APIRouter(prefix="/chat", tags=["chat"])

# Mock user data for testing
MOCK_USER_CONTEXT = {
    "user_id": 1,
    "username": "Асан",
    "age": 28,
    "monthly_income": 300000,
    "monthly_expenses": 200000,
    "risk_profile": "moderate",
    "islamic_knowledge": "intermediate",
    "goals": [
        {
            "goal_name": "Покупка квартиры",
            "target_amount": 5000000,
            "current_amount": 500000,
            "timeline_months": 60,
            "category": "housing",
            "priority": "high"
        },
        {
            "goal_name": "Хадж",
            "target_amount": 1500000, 
            "current_amount": 200000,
            "timeline_months": 24,
            "category": "hajj",
            "priority": "medium"
        }
    ],
    "recent_transactions": [
        {"category": "housing", "amount": 50000, "description": "Аренда квартиры"},
        {"category": "food", "amount": 15000, "description": "Продукты"},
        {"category": "transport", "amount": 8000, "description": "Транспорт"},
    ]
}

@router.post("/message", response_model=AIResponse)
async def send_chat_message(chat_message: ChatMessage):
    try:
        # Get AI response with user context
        ai_response = islamic_ai_service.chat_with_context(
            user_message=chat_message.message,
            user_context=MOCK_USER_CONTEXT
        )
        
        return AIResponse(
            response=ai_response["response"],
            recommendations=ai_response["recommendations"],
            suggested_products=ai_response["suggested_products"],
            monthly_plan=None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@router.post("/financial-plan")
async def generate_financial_plan():
    try:
        plan = islamic_ai_service.create_financial_plan(
            user_profile=MOCK_USER_CONTEXT,
            goals=MOCK_USER_CONTEXT["goals"]
        )
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating plan: {str(e)}")

@router.post("/spending-analysis")
async def analyze_spending():
    try:
        analysis = islamic_ai_service.analyze_spending_habits(
            transactions=MOCK_USER_CONTEXT["recent_transactions"],
            user_profile=MOCK_USER_CONTEXT
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing spending: {str(e)}")