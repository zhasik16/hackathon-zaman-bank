from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, Optional
import json

from ..services.ai_service import islamic_ai_service
from ..models.user import UserFinancialUpdate

router = APIRouter(prefix="/chat", tags=["chat"])

# Mock user data for testing
MOCK_USER_CONTEXT = {
    "user_id": 1,
    "username": "Асан",
    "age": 28,
    "monthly_income": 500000,
    "monthly_expenses": 350000,
    "risk_profile": "moderate",
    "islamic_knowledge": "intermediate",
    "currency": "KZT",
    "family_size": 3,
    "goals": [
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
        }
    ],
    "recent_transactions": [
        {"category": "housing", "amount": 150000, "description": "Аренда квартиры"},
        {"category": "food", "amount": 75000, "description": "Продукты"},
        {"category": "transport", "amount": 30000, "description": "Транспорт"},
    ]
}

@router.post("/message")
async def send_chat_message(
    message: str = Form(...),
    message_type: str = Form("text"),
    context: Optional[str] = Form(None)
):
    """
    Handle both text and voice messages
    """
    try:
        print(f"Received message: {message}, type: {message_type}")  # Debug log
        
        # Parse context if provided
        user_context = MOCK_USER_CONTEXT.copy()
        if context:
            try:
                context_data = json.loads(context)
                user_context.update(context_data)
            except json.JSONDecodeError:
                print("Failed to parse context JSON")

        # Get AI response with user context
        if message_type == "voice":
            # For voice messages, we expect the message to be transcribed text
            ai_response = await islamic_ai_service.get_voice_response(
                audio_file=None,  # In real app, you'd get the file
                user_context=user_context
            )
        else:
            # For text messages
            ai_response = await islamic_ai_service.get_chat_response(
                user_message=message,
                user_context=user_context
            )
        
        return {
            "response": ai_response.get("response", "Извините, не удалось обработать запрос."),
            "recommendations": ai_response.get("recommendations", []),
            "suggested_products": ai_response.get("suggested_products", []),
            "transcribed_text": ai_response.get("transcribed_text"),
            "message_type": ai_response.get("message_type", "financial_advice")
        }
        
    except Exception as e:
        print(f"Error in send_chat_message: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing message: {str(e)}"
        )

@router.post("/message/voice")
async def send_voice_message(
    audio: UploadFile = File(...),
    context: Optional[str] = Form(None)
):
    """
    Handle voice messages specifically
    """
    try:
        print(f"Processing voice message: {audio.filename}")  # Debug log
        
        # Parse context if provided
        user_context = MOCK_USER_CONTEXT.copy()
        if context:
            try:
                context_data = json.loads(context)
                user_context.update(context_data)
            except json.JSONDecodeError:
                print("Failed to parse context JSON")

        # Process voice message
        ai_response = await islamic_ai_service.get_voice_response(
            audio_file=audio.file,
            user_context=user_context
        )
        
        return {
            "response": ai_response.get("response", "Извините, не удалось обработать голосовое сообщение."),
            "recommendations": ai_response.get("recommendations", []),
            "suggested_products": ai_response.get("suggested_products", []),
            "transcribed_text": ai_response.get("transcribed_text"),
            "message_type": ai_response.get("message_type", "voice_response")
        }
        
    except Exception as e:
        print(f"Error in send_voice_message: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing voice message: {str(e)}"
        )

@router.post("/financial-plan")
async def generate_financial_plan():
    try:
        plan = await islamic_ai_service.create_financial_plan(
            user_profile=MOCK_USER_CONTEXT,
            goals=MOCK_USER_CONTEXT["goals"]
        )
        return plan
    except Exception as e:
        print(f"Error generating financial plan: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating plan: {str(e)}"
        )

@router.post("/spending-analysis")
async def analyze_spending():
    try:
        analysis = islamic_ai_service.analyze_spending_habits(
            transactions=MOCK_USER_CONTEXT["recent_transactions"],
            user_profile=MOCK_USER_CONTEXT
        )
        return analysis
    except Exception as e:
        print(f"Error analyzing spending: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500, 
            detail=f"Error analyzing spending: {str(e)}"
        )

@router.get("/history")
async def get_chat_history(user_id: int = 1):
    """Get chat history for user"""
    try:
        # Mock chat history
        return {
            "user_id": user_id,
            "messages": [
                {
                    "id": 1,
                    "content": "Ассаламу алейкум! Как я могу помочь с вашими финансами?",
                    "is_user": False,
                    "timestamp": "2024-01-15T10:00:00Z"
                },
                {
                    "id": 2,
                    "content": "Хочу поставить финансовую цель",
                    "is_user": True,
                    "timestamp": "2024-01-15T10:01:00Z"
                }
            ],
            "total_messages": 2
        }
    except Exception as e:
        print(f"Error getting chat history: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting chat history: {str(e)}"
        )

@router.delete("/history")
async def clear_chat_history(user_id: int = 1):
    """Clear chat history for user"""
    try:
        return {
            "success": True,
            "message": "История чата очищена",
            "user_id": user_id
        }
    except Exception as e:
        print(f"Error clearing chat history: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error clearing chat history: {str(e)}"
        )

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio to text"""
    try:
        transcribed_text = await islamic_ai_service.transcribe_audio(audio.file)
        return {
            "transcribed_text": transcribed_text,
            "audio_file": audio.filename,
            "success": True
        }
    except Exception as e:
        print(f"Error transcribing audio: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error transcribing audio: {str(e)}"
        )

# Health check endpoint for chat service
@router.get("/health")
async def chat_health_check():
    """Health check for chat service"""
    try:
        # Test AI service connectivity
        test_response = await islamic_ai_service.get_chat_response(
            user_message="Test",
            user_context=MOCK_USER_CONTEXT
        )
        
        return {
            "status": "healthy",
            "service": "chat",
            "ai_service": "responsive",
            "timestamp": "2024-01-15T10:00:00Z"
        }
    except Exception as e:
        return {
            "status": "degraded",
            "service": "chat",
            "ai_service": f"unavailable: {str(e)}",
            "timestamp": "2024-01-15T10:00:00Z"
        }