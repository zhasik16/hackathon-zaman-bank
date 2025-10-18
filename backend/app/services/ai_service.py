import requests
import json
import logging
from typing import Dict, List, Any, Optional
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IslamicAIService:
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.base_url = settings.AI_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Islamic Finance Knowledge Base
        self.islamic_principles = """
        Принципы исламских финансов:
        1. Запрет риба (ростовщичества, процентов)
        2. Запрет гарара (чрезмерной неопределенности)
        3. Запрет майсир (азартных игр)
        4. Соответствие шариату во всех операциях
        5. Реальная экономическая деятельность
        6. Справедливое распределение прибылей и убытков
        
        Разрешенные финансовые инструменты:
        - Мурабаха (продажа с наценкой)
        - Мудараба (партнерство с разделением прибыли) 
        - Мушарака (совместное предприятие)
        - Иджара (аренда)
        - Салам (авансовая оплата)
        - Истисна (производственное финансирование)
        """

    def get_ai_response(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini") -> str:
        """Основной метод для общения с AI"""
        url = f"{self.base_url}/v1/chat/completions"
        
        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1500
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Error in AI service: {e}")
            return "Извините, произошла ошибка при обработке вашего запроса."

    def create_financial_plan(self, user_profile: Dict[str, Any], goals: List[Dict]) -> Dict[str, Any]:
        """Создание исламского финансового плана"""
        system_prompt = f"""
        Ты - экспертный исламский финансовый советник банка Zaman. Твоя задача - создавать персонализированные финансовые планы в строгом соответствии с принципами шариата.

        {self.islamic_principles}

        Критические правила:
        - НИКАКИХ предложений с процентами (риба)
        - Только халяльные инвестиции и продукты
        - Учитывай социальную ответственность (закят, садака)
        - Рекомендуй реальную экономическую деятельность

        Структура ответа в JSON:
        {{
            "monthly_plan": {{
                "essential_spending": amount,
                "savings": amount, 
                "investments": amount,
                "charity": amount,
                "personal_development": amount
            }},
            "recommendations": ["list", "of", "recommendations"],
            "islamic_products": ["product1", "product2"],
            "risk_assessment": "low/medium/high",
            "timeline_analysis": "analysis text"
        }}
        """

        user_context = f"""
        Профиль пользователя:
        - Возраст: {user_profile.get('age', 'Не указан')}
        - Ежемесячный доход: {user_profile.get('monthly_income', 0)} ₸
        - Уровень знаний ислама: {user_profile.get('islamic_knowledge', 'beginner')}
        - Профиль риска: {user_profile.get('risk_profile', 'moderate')}

        Финансовые цели:
        {json.dumps(goals, ensure_ascii=False, indent=2)}

        Создай детальный исламский финансовый план.
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_context}
        ]

        response = self.get_ai_response(messages)
        
        try:
            # Парсим JSON ответ
            return json.loads(response)
        except:
            # Если не JSON, возвращаем структурированный ответ
            return {
                "monthly_plan": {
                    "essential_spending": user_profile.get('monthly_income', 0) * 0.5,
                    "savings": user_profile.get('monthly_income', 0) * 0.2,
                    "investments": user_profile.get('monthly_income', 0) * 0.15,
                    "charity": user_profile.get('monthly_income', 0) * 0.025,
                    "personal_development": user_profile.get('monthly_income', 0) * 0.125
                },
                "recommendations": ["Начните с создания бюджета", "Рассмотрите исламские сберегательные продукты"],
                "islamic_products": ["Мудараба Сберегательный"],
                "risk_assessment": user_profile.get('risk_profile', 'moderate'),
                "timeline_analysis": response[:500]  # Берем первые 500 символов анализа
            }

    def analyze_spending_habits(self, transactions: List[Dict], user_profile: Dict) -> Dict[str, Any]:
        """Анализ привычек расходов с исламской перспективой"""
        system_prompt = f"""
        Ты - исламский финансовый консультант. Анализируй привычки расходов и давай рекомендации в соответствии с шариатом.

        {self.islamic_principles}

        Особое внимание:
        - Избегать излишеств (исраф)
        - Поощрять умеренность (иктисад)
        - Выявлять потенциально харамные расходы
        - Рекомендовать благотворительность (садака)

        Структура ответа:
        {{
            "spending_analysis": {{
                "halal_spending": amount,
                "questionable_spending": amount,
                "essential_spending": amount,
                "discretionary_spending": amount
            }},
            "habits_to_improve": ["habit1", "habit2"],
            "islamic_recommendations": ["rec1", "rec2"],
            "charity_suggestions": ["suggestion1", "suggestion2"],
            "stress_alternatives": ["alternative1", "alternative2"]
        }}
        """

        transactions_summary = "\n".join([
            f"- {t['category']}: {t['amount']} ₸ ({t['description']})" 
            for t in transactions[:20]  # Ограничиваем для контекста
        ])

        user_context = f"""
        Профиль пользователя:
        - Доход: {user_profile.get('monthly_income', 0)} ₸/месяц
        - Возраст: {user_profile.get('age', 'Не указан')}
        
        Последние транзакции:
        {transactions_summary}

        Проанализируй привычки расходов и дай рекомендации согласно исламским принципам.
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_context}
        ]

        response = self.get_ai_response(messages)
        
        try:
            return json.loads(response)
        except:
            return {
                "spending_analysis": {
                    "halal_spending": sum(t['amount'] for t in transactions if t.get('is_halal', True)),
                    "questionable_spending": 0,
                    "essential_spending": sum(t['amount'] for t in transactions if t['category'] in ['housing', 'food', 'health']),
                    "discretionary_spending": sum(t['amount'] for t in transactions if t['category'] in ['entertainment', 'dining'])
                },
                "habits_to_improve": ["Сократите ненужные расходы", "Планируйте бюджет заранее"],
                "islamic_recommendations": ["Выделяйте 2.5% на закят", "Избегайте излишеств"],
                "charity_suggestions": ["Регулярная садака", "Поддержка местных мечетей"],
                "stress_alternatives": ["Молитва", "Чтение Корана", "Семейное время"]
            }

    def recommend_products(self, user_goals: List[Dict], user_profile: Dict) -> List[Dict[str, Any]]:
        """Рекомендация исламских финансовых продуктов"""
        recommended_products = []
        
        for goal in user_goals:
            goal_amount = goal.get('target_amount', 0)
            timeline = goal.get('timeline_months', 12)
            
            if goal['category'] == 'housing' and goal_amount > 1000000:
                recommended_products.append({
                    "product_id": "murabaha_housing",
                    "name": "Мурабаха Жилье",
                    "type": "credit",
                    "suitable_for": "Покупка недвижимости",
                    "min_amount": 1000000,
                    "max_amount": 50000000,
                    "description": "Финансирование с фиксированной наценкой, соответствующее шариату",
                    "sharia_compliant": True,
                    "estimated_monthly": goal_amount / timeline
                })
            
            elif goal['category'] in ['education', 'hajj', 'marriage']:
                recommended_products.append({
                    "product_id": "mudaraba_savings",
                    "name": "Мудараба Сберегательный", 
                    "type": "deposit",
                    "suitable_for": "Накопление на важные цели",
                    "min_amount": 50000,
                    "max_amount": 10000000,
                    "description": "Участие в прибыли банка без риба",
                    "sharia_compliant": True,
                    "estimated_monthly": goal_amount / timeline
                })
            
            elif goal['category'] == 'business' and goal_amount > 500000:
                recommended_products.append({
                    "product_id": "musharaka_business", 
                    "name": "Мушарака Бизнес",
                    "type": "investment",
                    "suitable_for": "Начало или развитие бизнеса",
                    "min_amount": 500000,
                    "max_amount": 50000000,
                    "description": "Совместное предпринимательство с разделением прибыли",
                    "sharia_compliant": True,
                    "estimated_monthly": goal_amount / timeline
                })
        
        return recommended_products

    def chat_with_context(self, user_message: str, user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Умный чат с учетом контекста пользователя"""
        system_prompt = f"""
        Ты - Zaman AI Assistant, интеллектуальный исламский финансовый помощник.

        {self.islamic_principles}

        Твои ключевые качества:
        - Глубокие знания исламских финансов
        - Эмпатия и понимание
        - Практические советы
        - Строгое соответствие шариату
        - Поддержка на казахском и русском языках

        Всегда:
        - Используй имя пользователя если известно
        - Предлагай конкретные исламские решения
        - Объясняй почему рекомендация соответствует шариату
        - Будь поддерживающим и мотивирующим
        - Предлагай альтернативы стрессу без трат
        """

        context_str = json.dumps(user_context, ensure_ascii=False)

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Контекст пользователя: {context_str}"},
            {"role": "user", "content": user_message}
        ]

        ai_response = self.get_ai_response(messages)
        
        # Генерация дополнительных рекомендаций на основе ответа
        recommendations = self._extract_recommendations(ai_response)
        products = self.recommend_products(user_context.get('goals', []), user_context)
        
        return {
            "response": ai_response,
            "recommendations": recommendations,
            "suggested_products": products[:3],  # Ограничиваем 3 продуктами
            "message_type": "financial_advice"
        }

    def _extract_recommendations(self, response: str) -> List[str]:
        """Извлечение рекомендаций из AI ответа"""
        # Простая логика извлечения рекомендаций
        recommendations = []
        lines = response.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('- ') or line.startswith('• ') or ('рекоменд' in line.lower() and len(line) < 100):
                recommendations.append(line)
        
        return recommendations[:5]  # Ограничиваем 5 рекомендациями

# Глобальный экземпляр сервиса
islamic_ai_service = IslamicAIService()