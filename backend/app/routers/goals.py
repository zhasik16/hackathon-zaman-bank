from fastapi import APIRouter, HTTPException
from typing import List

from ..models.financial import FinancialGoalCreate, FinancialGoalResponse
from ..services.financial_calculator import financial_calculator

router = APIRouter(prefix="/goals", tags=["goals"])

# Mock storage for goals
mock_goals_storage = []

@router.post("/", response_model=FinancialGoalResponse)
async def create_goal(goal: FinancialGoalCreate):
    try:
        monthly_saving = financial_calculator.calculate_monthly_saving(
            goal.target_amount, 0, goal.timeline_months
        )
        
        progress = financial_calculator.calculate_goal_progress(0, goal.target_amount)
        
        goal_response = FinancialGoalResponse(
            id=len(mock_goals_storage) + 1,
            user_id=1,  # Mock user ID
            goal_name=goal.goal_name,
            target_amount=goal.target_amount,
            current_amount=0,
            timeline_months=goal.timeline_months,
            category=goal.category,
            priority=goal.priority,
            islamic_importance=goal.islamic_importance,
            monthly_saving=monthly_saving,
            progress_percentage=progress
        )
        
        mock_goals_storage.append(goal_response.dict())
        return goal_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating goal: {str(e)}")

@router.get("/", response_model=List[FinancialGoalResponse])
async def get_goals():
    return mock_goals_storage

@router.get("/{goal_id}", response_model=FinancialGoalResponse)
async def get_goal(goal_id: int):
    try:
        goal = next((g for g in mock_goals_storage if g["id"] == goal_id), None)
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        return goal
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving goal: {str(e)}")