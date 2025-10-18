from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from ..services.ai_service import islamic_ai_service
from ..services.financial_calculator import financial_calculator
from ..services.islamic_validator import islamic_validator

router = APIRouter(prefix="/analysis", tags=["analysis"])

# Mock transactions data for testing
MOCK_TRANSACTIONS = [
    {"id": 1, "user_id": 1, "amount": 50000, "category": "housing", "description": "Аренда квартиры", "transaction_type": "expense", "is_halal": True},
    {"id": 2, "user_id": 1, "amount": 15000, "category": "food", "description": "Продукты", "transaction_type": "expense", "is_halal": True},
    {"id": 3, "user_id": 1, "amount": 8000, "category": "transport", "description": "Транспорт", "transaction_type": "expense", "is_halal": True},
    {"id": 4, "user_id": 1, "amount": 12000, "category": "entertainment", "description": "Ресторан", "transaction_type": "expense", "is_halal": True},
    {"id": 5, "user_id": 1, "amount": 300000, "category": "salary", "description": "Зарплата", "transaction_type": "income", "is_halal": True},
]

@router.get("/spending")
async def get_spending_analysis():
    try:
        # Basic financial analysis
        basic_analysis = financial_calculator.analyze_spending_pattern(MOCK_TRANSACTIONS)
        
        # Islamic AI analysis
        user_profile = {
            "monthly_income": 300000,
            "age": 28,
            "risk_profile": "moderate"
        }
        
        islamic_analysis = islamic_ai_service.analyze_spending_habits(
            transactions=MOCK_TRANSACTIONS,
            user_profile=user_profile
        )
        
        return {
            "basic_analysis": basic_analysis,
            "islamic_analysis": islamic_analysis,
            "transactions": MOCK_TRANSACTIONS
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing spending: {str(e)}")

@router.get("/habits")
async def get_habit_analysis():
    try:
        user_profile = {
            "monthly_income": 300000,
            "monthly_expenses": 200000,
            "age": 28,
            "risk_profile": "moderate",
            "islamic_knowledge": "intermediate"
        }
        
        analysis = islamic_ai_service.analyze_spending_habits(
            transactions=MOCK_TRANSACTIONS,
            user_profile=user_profile
        )
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing habits: {str(e)}")

@router.post("/validate-transaction")
async def validate_transaction(transaction: Dict[str, Any]):
    try:
        is_valid, message = islamic_validator.validate_transaction(transaction)
        
        return {
            "is_valid": is_valid,
            "message": message,
            "transaction": transaction
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating transaction: {str(e)}")

@router.get("/islamic-products")
async def get_islamic_products():
    try:
        user_goals = [
            {
                "goal_name": "Покупка квартиры",
                "target_amount": 5000000,
                "timeline_months": 60,
                "category": "housing"
            }
        ]
        
        user_profile = {
            "monthly_income": 300000,
            "risk_profile": "moderate"
        }
        
        products = islamic_ai_service.recommend_products(user_goals, user_profile)
        
        return {
            "products": products,
            "total_recommended": len(products)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting products: {str(e)}")

@router.get("/life-goals")
async def get_life_goals_analysis():
    try:
        user_profile = {
            "age": 28,
            "monthly_income": 300000,
            "risk_profile": "moderate"
        }
        
        user_goals = [
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
            },
            {
                "goal_name": "Образование детей",
                "target_amount": 2000000,
                "current_amount": 300000,
                "timeline_months": 48,
                "category": "education",
                "priority": "high"
            }
        ]
        
        # Generate financial plan
        financial_plan = islamic_ai_service.create_financial_plan(user_profile, user_goals)
        
        # Calculate monthly savings for each goal
        goals_with_savings = []
        for goal in user_goals:
            monthly_saving = financial_calculator.calculate_monthly_saving(
                goal["target_amount"], goal["current_amount"], goal["timeline_months"]
            )
            progress = financial_calculator.calculate_goal_progress(
                goal["current_amount"], goal["target_amount"]
            )
            
            goals_with_savings.append({
                **goal,
                "monthly_saving": monthly_saving,
                "progress_percentage": progress
            })
        
        return {
            "financial_plan": financial_plan,
            "goals": goals_with_savings,
            "total_monthly_savings": sum(g["monthly_saving"] for g in goals_with_savings)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing life goals: {str(e)}")