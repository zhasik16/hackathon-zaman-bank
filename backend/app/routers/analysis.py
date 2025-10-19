from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from datetime import datetime

from ..services.ai_service import islamic_ai_service
from ..services.financial_calculator import financial_calculator
from ..services.islamic_validator import islamic_validator
from ..models.user import FinancialMetrics, BudgetRecommendation

router = APIRouter(prefix="/analysis", tags=["analysis"])

# Mock transactions data for testing
MOCK_TRANSACTIONS = [
    {"id": 1, "user_id": 1, "amount": 150000, "category": "housing", "description": "Аренда квартиры", "transaction_type": "expense", "is_halal": True, "date": "2024-01-15"},
    {"id": 2, "user_id": 1, "amount": 75000, "category": "food", "description": "Продукты", "transaction_type": "expense", "is_halal": True, "date": "2024-01-10"},
    {"id": 3, "user_id": 1, "amount": 30000, "category": "transport", "description": "Транспорт", "transaction_type": "expense", "is_halal": True, "date": "2024-01-08"},
    {"id": 4, "user_id": 1, "amount": 25000, "category": "entertainment", "description": "Ресторан", "transaction_type": "expense", "is_halal": True, "date": "2024-01-12"},
    {"id": 5, "user_id": 1, "amount": 20000, "category": "health", "description": "Медицина", "transaction_type": "expense", "is_halal": True, "date": "2024-01-05"},
    {"id": 6, "user_id": 1, "amount": 500000, "category": "salary", "description": "Зарплата", "transaction_type": "income", "is_halal": True, "date": "2024-01-01"},
]

@router.get("/spending")
async def get_spending_analysis(time_range: str = "month", user_id: int = 1):
    """Get spending analysis with time range support"""
    try:
        # Filter transactions based on time range
        filtered_transactions = _filter_transactions_by_time_range(MOCK_TRANSACTIONS, time_range)
        
        # Basic financial analysis
        basic_analysis = financial_calculator.analyze_spending_pattern(filtered_transactions)
        
        # Islamic AI analysis
        user_profile = {
            "monthly_income": 500000,
            "monthly_expenses": 300000,
            "age": 30,
            "risk_profile": "moderate",
            "family_size": 3
        }
        
        islamic_analysis = islamic_ai_service.analyze_spending_habits(
            transactions=filtered_transactions,
            user_profile=user_profile
        )
        
        # Calculate financial metrics
        financial_metrics = _calculate_financial_metrics(user_profile, basic_analysis)
        
        return {
            "time_range": time_range,
            "basic_analysis": basic_analysis,
            "islamic_analysis": islamic_analysis,
            "financial_metrics": financial_metrics,
            "transactions": filtered_transactions,
            "total_transactions": len(filtered_transactions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing spending: {str(e)}")

@router.get("/financial-metrics")
async def get_financial_metrics(user_id: int = 1):
    """Get comprehensive financial metrics"""
    try:
        user_profile = {
            "monthly_income": 500000,
            "monthly_expenses": 300000,
            "age": 30,
            "risk_profile": "moderate",
            "family_size": 3
        }
        
        basic_analysis = financial_calculator.analyze_spending_pattern(MOCK_TRANSACTIONS)
        metrics = _calculate_financial_metrics(user_profile, basic_analysis)
        
        return metrics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating metrics: {str(e)}")

@router.get("/budget-recommendations")
async def get_budget_recommendations(user_id: int = 1):
    """Get Islamic budget recommendations"""
    try:
        user_profile = {
            "monthly_income": 500000,
            "monthly_expenses": 300000,
            "family_size": 3
        }
        
        current_spending = {
            "housing": 150000,
            "food": 75000,
            "transport": 30000,
            "health": 20000,
            "entertainment": 25000
        }
        
        recommendations = _generate_budget_recommendations(user_profile, current_spending)
        
        return {
            "recommendations": recommendations,
            "islamic_budget": financial_calculator.generate_islamic_budget(user_profile["monthly_income"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/comparative")
async def get_comparative_analysis(user_id: int = 1):
    """Get comparative analysis for all time ranges"""
    try:
        comparative_data = {}
        
        for time_range in ["week", "month", "year"]:
            filtered_transactions = _filter_transactions_by_time_range(MOCK_TRANSACTIONS, time_range)
            basic_analysis = financial_calculator.analyze_spending_pattern(filtered_transactions)
            
            comparative_data[time_range] = {
                "total_income": basic_analysis["total_income"],
                "total_expenses": basic_analysis["total_expenses"],
                "savings": basic_analysis["total_income"] - basic_analysis["total_expenses"],
                "savings_rate": basic_analysis["savings_rate"],
                "transaction_count": len(filtered_transactions)
            }
        
        return {
            "comparative_analysis": comparative_data,
            "generated_at": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating comparative analysis: {str(e)}")

@router.get("/habits")
async def get_habit_analysis():
    try:
        user_profile = {
            "monthly_income": 500000,
            "monthly_expenses": 300000,
            "age": 30,
            "risk_profile": "moderate",
            "islamic_knowledge": "intermediate",
            "family_size": 3
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
                "target_amount": 15000000,
                "timeline_months": 60,
                "category": "housing"
            }
        ]
        
        user_profile = {
            "monthly_income": 500000,
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
            "age": 30,
            "monthly_income": 500000,
            "monthly_expenses": 300000,
            "risk_profile": "moderate",
            "family_size": 3
        }
        
        user_goals = [
            {
                "goal_name": "Покупка квартиры",
                "target_amount": 15000000,
                "current_amount": 1000000,
                "timeline_months": 60,
                "category": "housing",
                "priority": "high"
            },
            {
                "goal_name": "Хадж",
                "target_amount": 2000000,
                "current_amount": 300000, 
                "timeline_months": 24,
                "category": "hajj",
                "priority": "medium"
            },
            {
                "goal_name": "Образование детей",
                "target_amount": 5000000,
                "current_amount": 500000,
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
            "total_monthly_savings": sum(g["monthly_saving"] for g in goals_with_savings),
            "available_for_savings": user_profile["monthly_income"] - user_profile["monthly_expenses"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing life goals: {str(e)}")

# Helper functions
def _filter_transactions_by_time_range(transactions: List[Dict], time_range: str) -> List[Dict]:
    """Filter transactions based on time range"""
    now = datetime.now()
    
    if time_range == "week":
        cutoff_date = now - timedelta(days=7)
    elif time_range == "month":
        cutoff_date = now - timedelta(days=30)
    elif time_range == "year":
        cutoff_date = now - timedelta(days=365)
    else:
        return transactions  # Return all if invalid range
    
    # In real app, filter by actual dates
    # For mock data, return proportional data
    factor = {"week": 0.25, "month": 1, "year": 12}.get(time_range, 1)
    
    filtered_transactions = []
    for transaction in transactions:
        filtered_transaction = transaction.copy()
        if transaction["transaction_type"] == "expense":
            filtered_transaction["amount"] = transaction["amount"] * factor
        filtered_transactions.append(filtered_transaction)
    
    return filtered_transactions

def _calculate_financial_metrics(user_profile: Dict, basic_analysis: Dict) -> FinancialMetrics:
    """Calculate comprehensive financial metrics"""
    monthly_income = user_profile["monthly_income"]
    monthly_expenses = basic_analysis["total_expenses"]
    monthly_savings = monthly_income - monthly_expenses
    savings_rate = monthly_savings / monthly_income if monthly_income > 0 else 0
    
    # Calculate essential vs discretionary spending
    essential_categories = ["housing", "food", "transport", "health"]
    essential_spending = sum(
        basic_analysis["expenses_by_category"].get(cat, 0) 
        for cat in essential_categories
    )
    discretionary_spending = monthly_expenses - essential_spending
    
    # Generate Islamic budget recommendations
    islamic_budget = financial_calculator.generate_islamic_budget(monthly_income)
    
    # Calculate financial health score (0-100)
    financial_health_score = min(100, int(savings_rate * 200))  # 50% savings rate = 100 score
    
    # Generate recommendations
    recommendations = _generate_financial_recommendations(user_profile, basic_analysis)
    
    return FinancialMetrics(
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        monthly_savings=monthly_savings,
        savings_rate=savings_rate,
        essential_spending=essential_spending,
        discretionary_spending=discretionary_spending,
        recommended_budget=islamic_budget,
        islamic_finance_recommendations=recommendations,
        financial_health_score=financial_health_score
    )

def _generate_budget_recommendations(user_profile: Dict, current_spending: Dict) -> List[BudgetRecommendation]:
    """Generate budget recommendations based on Islamic principles"""
    monthly_income = user_profile["monthly_income"]
    islamic_budget = financial_calculator.generate_islamic_budget(monthly_income)
    
    recommendations = []
    for category, recommended_amount in islamic_budget.items():
        current_amount = current_spending.get(category, 0)
        difference = current_amount - recommended_amount
        
        # Generate advice based on difference
        if difference > 0:
            advice = f"Сократите расходы на {abs(difference):,.0f} ₸"
        elif difference < 0:
            advice = f"Можете увеличить на {abs(difference):,.0f} ₸"
        else:
            advice = "Оптимальный уровень расходов"
        
        recommendations.append(BudgetRecommendation(
            category=category,
            recommended_percentage=(recommended_amount / monthly_income) * 100,
            recommended_amount=recommended_amount,
            current_amount=current_amount,
            difference=difference,
            advice=advice
        ))
    
    return recommendations

def _generate_financial_recommendations(user_profile: Dict, analysis: Dict) -> List[str]:
    """Generate Islamic finance recommendations"""
    recommendations = []
    savings_rate = analysis["savings_rate"]
    
    if savings_rate < 0.1:
        recommendations.append("Увеличьте норму сбережений до 20% от дохода")
    elif savings_rate < 0.2:
        recommendations.append("Хорошая норма сбережений, стремитесь к 20%")
    else:
        recommendations.append("Отличная норма сбережений! Рассмотрите инвестиции")
    
    recommendations.append(f"Выделяйте {user_profile['monthly_income'] * 0.025:,.0f} ₸ на закят")
    recommendations.append("Рассмотрите исламские инвестиционные продукты")
    
    return recommendations