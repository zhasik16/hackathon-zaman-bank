from typing import Dict, List, Any
from datetime import datetime, timedelta

class IslamicFinancialCalculator:
    @staticmethod
    def calculate_monthly_saving(goal_amount: float, current_amount: float, timeline_months: int) -> float:
        """Рассчет ежемесячных сбережений для цели"""
        remaining_amount = goal_amount - current_amount
        if timeline_months <= 0:
            return remaining_amount
        return remaining_amount / timeline_months

    @staticmethod
    def calculate_goal_progress(current_amount: float, target_amount: float) -> float:
        """Рассчет прогресса цели в процентах"""
        if target_amount <= 0:
            return 0
        return (current_amount / target_amount) * 100

    @staticmethod
    def analyze_spending_pattern(transactions: List[Dict]) -> Dict[str, Any]:
        """Анализ паттернов расходов"""
        expenses_by_category = {}
        total_income = 0
        total_expenses = 0
        
        for transaction in transactions:
            if transaction["transaction_type"] == "income":
                total_income += transaction["amount"]
            else:
                total_expenses += transaction["amount"]
                category = transaction["category"]
                expenses_by_category[category] = expenses_by_category.get(category, 0) + transaction["amount"]
        
        savings_rate = (total_income - total_expenses) / total_income if total_income > 0 else 0
        
        return {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "savings_rate": savings_rate,
            "expenses_by_category": expenses_by_category
        }

    @staticmethod
    def calculate_zakat(assets: Dict[str, float]) -> float:
        """Рассчет закята (2.5% от чистых активов)"""
        total_assets = sum(assets.values())
        nisab = 85000  # Нисаб в тенге (примерно 85г золота)
        
        if total_assets < nisab:
            return 0
        
        return total_assets * 0.025  # 2.5%

    @staticmethod
    def generate_islamic_budget(monthly_income: float) -> Dict[str, float]:
        """Генерация бюджета согласно исламским принципам"""
        return {
            "essential_spending": monthly_income * 0.5,      # 50% - основные расходы
            "savings": monthly_income * 0.2,                # 20% - сбережения
            "investments": monthly_income * 0.15,           # 15% - инвестиции
            "charity": monthly_income * 0.025,              # 2.5% - закят
            "personal_development": monthly_income * 0.125  # 12.5% - саморазвитие
        }

financial_calculator = IslamicFinancialCalculator()