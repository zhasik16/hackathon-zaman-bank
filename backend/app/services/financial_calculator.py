from typing import Dict, List, Any, Tuple
from datetime import datetime, timedelta
from ..models.user import FinancialMetrics, BudgetRecommendation

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
        progress = (current_amount / target_amount) * 100
        return min(progress, 100)  # Cap at 100%

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

    @staticmethod
    def calculate_financial_health(monthly_income: float, monthly_expenses: float, savings: float) -> Tuple[str, int]:
        """Оценка финансового здоровья"""
        savings_rate = savings / monthly_income if monthly_income > 0 else 0
        
        if savings_rate >= 0.2:
            health = "excellent"
            score = 90
        elif savings_rate >= 0.15:
            health = "good"
            score = 75
        elif savings_rate >= 0.1:
            health = "fair"
            score = 60
        elif savings_rate >= 0:
            health = "needs_improvement"
            score = 40
        else:
            health = "critical"
            score = 20
            
        return health, score

    @staticmethod
    def generate_time_based_analysis(user_data: Dict, time_range: str) -> Dict[str, Any]:
        """Генерация анализа для разных временных периодов"""
        monthly_income = user_data.get('monthly_income', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        
        # Multipliers for different time ranges
        multipliers = {
            'week': 0.25,
            'month': 1,
            'year': 12
        }
        
        multiplier = multipliers.get(time_range, 1)
        
        # Adjust expense distribution based on time range
        if time_range == 'week':
            expense_distribution = {
                'housing': monthly_expenses * multiplier * 0.3,
                'food': monthly_expenses * multiplier * 0.3,
                'transport': monthly_expenses * multiplier * 0.2,
                'health': monthly_expenses * multiplier * 0.08,
                'entertainment': monthly_expenses * multiplier * 0.12
            }
        elif time_range == 'month':
            expense_distribution = {
                'housing': monthly_expenses * multiplier * 0.4,
                'food': monthly_expenses * multiplier * 0.25,
                'transport': monthly_expenses * multiplier * 0.15,
                'health': monthly_expenses * multiplier * 0.1,
                'entertainment': monthly_expenses * multiplier * 0.1
            }
        else:  # year
            expense_distribution = {
                'housing': monthly_expenses * multiplier * 0.45,
                'food': monthly_expenses * multiplier * 0.2,
                'transport': monthly_expenses * multiplier * 0.12,
                'health': monthly_expenses * multiplier * 0.15,
                'entertainment': monthly_expenses * multiplier * 0.08
            }
        
        total_income = monthly_income * multiplier
        total_expenses = sum(expense_distribution.values())
        savings = total_income - total_expenses
        savings_rate = savings / total_income if total_income > 0 else 0
        
        return {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'savings': savings,
            'savings_rate': savings_rate,
            'expenses_by_category': expense_distribution,
            'time_range': time_range
        }

    @staticmethod
    def calculate_goal_achievement_time(goal_amount: float, monthly_saving: float) -> int:
        """Рассчет времени достижения цели в месяцах"""
        if monthly_saving <= 0:
            return 0
        return int(goal_amount / monthly_saving)

    @staticmethod
    def optimize_savings_plan(goals: List[Dict], available_savings: float) -> Dict[str, Any]:
        """Оптимизация плана сбережений для нескольких целей"""
        total_required = sum(goal['monthly_saving'] for goal in goals)
        
        if available_savings >= total_required:
            # Can afford all goals
            return {
                'feasible': True,
                'allocations': {goal['goal_name']: goal['monthly_saving'] for goal in goals},
                'remaining_savings': available_savings - total_required
            }
        else:
            # Need to prioritize
            prioritized_goals = sorted(goals, key=lambda x: x.get('priority', 'medium'), reverse=True)
            allocations = {}
            remaining_budget = available_savings
            
            for goal in prioritized_goals:
                if remaining_budget >= goal['monthly_saving']:
                    allocations[goal['goal_name']] = goal['monthly_saving']
                    remaining_budget -= goal['monthly_saving']
                else:
                    allocations[goal['goal_name']] = remaining_budget
                    remaining_budget = 0
                    break
            
            return {
                'feasible': False,
                'allocations': allocations,
                'remaining_savings': remaining_budget,
                'advice': 'Рассмотрите увеличение сбережений или корректировку целей'
            }

financial_calculator = IslamicFinancialCalculator()