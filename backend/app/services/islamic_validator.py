from typing import Dict, List, Any, Tuple

class IslamicFinanceValidator:
    # Запрещенные виды деятельности согласно шариату
    HARAM_INDUSTRIES = [
        "alcohol", "tobacco", "gambling", "pork", "conventional_banking",
        "insurance", "adult_entertainment", "weapons"
    ]
    
    # Сомнительные (макрух) виды деятельности
    MAKRUH_INDUSTRIES = [
        "speculative_trading", "high_risk_investments", "excessive_leverage"
    ]

    @staticmethod
    def validate_transaction(transaction: Dict[str, Any]) -> Tuple[bool, str]:
        """Валидация транзакции на соответствие шариату"""
        description = transaction.get('description', '').lower()
        category = transaction.get('category', '').lower()
        amount = transaction.get('amount', 0)
        
        # Проверка на запрещенные категории
        for haram_industry in IslamicFinanceValidator.HARAM_INDUSTRIES:
            if haram_industry in description or haram_industry in category:
                return False, f"Транзакция связана с запрещенной деятельностью: {haram_industry}"
        
        # Проверка на излишества (исраф)
        if amount > 100000 and category in ['entertainment', 'luxury']:
            return False, "Избегайте излишних расходов на развлечения и роскошь"
        
        # Проверка на спекулятивные операции
        if 'speculative' in description or 'gambling' in description:
            return False, "Спекулятивные операции запрещены в исламе"
        
        return True, "Транзакция соответствует принципам шариата"

    @staticmethod
    def validate_investment(investment: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Валидация инвестиции на соответствие шариату"""
        issues = []
        
        # Проверка процентов
        if investment.get('interest_based', False):
            issues.append("Инвестиция основана на процентах (риба)")
        
        # Проверка отрасли
        industry = investment.get('industry', '').lower()
        for haram_industry in IslamicFinanceValidator.HARAM_INDUSTRIES:
            if haram_industry in industry:
                issues.append(f"Инвестиция в запрещенную отрасль: {haram_industry}")
        
        # Проверка на чрезмерную неопределенность (гарар)
        if investment.get('uncertainty_level', 0) > 0.7:
            issues.append("Высокий уровень неопределенности (гарар)")
        
        # Проверка на азартные игры (майсир)
        if investment.get('speculative', False):
            issues.append("Спекулятивный характер инвестиции (майсир)")
        
        return len(issues) == 0, issues

    @staticmethod
    def get_halal_alternatives(haram_activity: str) -> List[str]:
        """Предложить халяльные альтернативы"""
        alternatives = {
            "alcohol": ["Безалкогольные напитки", "Соки", "Чай/кофе"],
            "conventional_banking": ["Исламские банки", "Сберегательные кассы"],
            "gambling": ["Благотворительность", "Спорт", "Образование"],
            "speculative_trading": ["Реальные инвестиции", "Бизнес-партнерства"]
        }
        
        return alternatives.get(haram_activity, ["Обратитесь к исламскому финансовому консультанту"])

islamic_validator = IslamicFinanceValidator()