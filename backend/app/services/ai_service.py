import logging
from typing import Dict, List, Any, Optional
from ..core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IslamicAIService:
    def __init__(self):
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
        
        Важные концепции:
        - Закят - обязательная благотворительность (2.5% от сбережений)
        - Садака - добровольная благотворительность
        - Вакаф - благотворительный фонд
        - Таваккуль - упование на Аллаха после принятия мер
        """

    def get_ai_response(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini") -> str:
        """Mock метод - используем локальные ответы"""
        user_message = messages[-1]["content"] if messages else ""
        system_prompt = messages[0]["content"] if len(messages) > 1 else ""
        
        # Извлекаем имя пользователя из system prompt
        user_name = "пользователь"
        if "Имя:" in system_prompt:
            try:
                name_line = [line for line in system_prompt.split('\n') if 'Имя:' in line][0]
                user_name = name_line.split('Имя:')[1].strip()
            except:
                pass
        
        return self.get_mock_response(user_message, {"username": user_name})

    def get_mock_response(self, user_message: str, user_context: Dict[str, Any] = None) -> str:
        """Улучшенные mock ответы с персонализацией"""
        user_name = user_context.get('username', 'друг') if user_context else 'друг'
        monthly_income = user_context.get('monthly_income', 0)
        monthly_expenses = user_context.get('monthly_expenses', 0)
        goals = user_context.get('goals', [])
        age = user_context.get('age', 0)
        
        user_message_lower = user_message.lower()

        # Персонализированные ответы на основе контекста пользователя
        if any(word in user_message_lower for word in ['привет', 'салам', 'здравств', 'начать']):
            return f"Ассаламу алейкум, {user_name}! 🌙 Я ваш персональный помощник Zaman Bank. Вижу, ваш доход {monthly_income:,} ₸ в месяц. Чем могу помочь с вашими финансами в соответствии с принципами ислама?"

        elif any(word in user_message_lower for word in ['цель', 'накопить', 'сбереж']):
            if goals:
                goals_text = ", ".join([goal.get('name', 'цель') for goal in goals[:3]])
                total_goals_amount = sum(goal.get('target_amount', 0) for goal in goals)
                return f"""{user_name}, отлично! Работаем над вашими целями: {goals_text}.

Общая сумма целей: {total_goals_amount:,} ₸
Для достижения этих целей в рамках исламских финансов рекомендую:

1. Сберегательный счет Мудараба - для накоплений
2. Регулярные отчисления {max(monthly_income * 0.2, total_goals_amount / 60):,.0f} ₸/месяц
3. Планирование сроков для каждой цели

Какую цель хотите обсудить первой?"""
            else:
                return f"{user_name}, давайте поставим финансовые цели! Какую сумму хотите накопить и за какой срок? Помните - в исламских финансах мы используем только дозволенные инструменты."

        elif any(word in user_message_lower for word in ['совет', 'рекомендац', 'что делать']):
            savings = monthly_income - monthly_expenses
            return f"""{user_name}, вот мои персонализированные рекомендации для вас:

📊 ВАШ ФИНАНСОВЫЙ ПРОФИЛЬ:
• Доход: {monthly_income:,} ₸/месяц
• Расходы: {monthly_expenses:,} ₸/месяц  
• Сбережения: {savings:,} ₸/месяц

🎯 РЕКОМЕНДАЦИИ ПО ИСЛАМСКИМ ФИНАНСАМ:

1. БЮДЖЕТИРОВАНИЕ:
   - Основные нужды: {monthly_income * 0.5:,.0f} ₸ ({monthly_expenses:,.0f} ₸ текущие)
   - Сбережения: {monthly_income * 0.2:,.0f} ₸ ({savings:,.0f} ₸ текущие)
   - Инвестиции: {monthly_income * 0.15:,.0f} ₸
   - Закят: {monthly_income * 0.025:,.0f} ₸
   - Развитие: {monthly_income * 0.125:,.0f} ₸

2. СБЕРЕЖЕНИЯ: Открыть счет Мудараба для участия в прибыли

3. ИНВЕСТИЦИИ: Рассмотреть Мушарака для реального бизнеса

4. БЛАГОТВОРИТЕЛЬНОСТЬ: Выделять 2.5% от сбережений на закят"""

        elif any(word in user_message_lower for word in ['жилье', 'квартир', 'дом']):
            housing_goal = next((goal for goal in goals if goal.get('category') == 'housing'), None)
            if housing_goal:
                target = housing_goal.get('target_amount', 0)
                timeline = housing_goal.get('timeline_months', 60)
                monthly_saving = target / timeline if timeline > 0 else 0
                return f"""{user_name}, для покупки жилья за {target:,} ₸:

📅 ПЛАН НА {timeline} МЕСЯЦЕВ:
• Ежемесячные сбережения: {monthly_saving:,.0f} ₸
• Это {monthly_saving/monthly_income*100:.1f}% от вашего дохода

🏠 ИСЛАМСКИЕ РЕШЕНИЯ:
1. Мурабаха Жилье - финансирование без процентов
2. Поэтапное накопление через Мудараба
3. Рассмотреть вариант с партнерством (Мушарака)

Рекомендую начать с {max(monthly_income * 0.15, monthly_saving):,.0f} ₸/месяц"""
            else:
                return f"{user_name}, для покупки жилья рекомендую программу 'Мурабаха Жилье' - финансирование без процентов. Какая сумма вам нужна и за какой срок планируете покупку?"

        elif any(word in user_message_lower for word in ['хадж', 'умра', 'мекк']):
            hajj_goal = next((goal for goal in goals if goal.get('category') == 'hajj'), None)
            if hajj_goal:
                target = hajj_goal.get('target_amount', 1500000)
                timeline = hajj_goal.get('timeline_months', 24)
                monthly_saving = target / timeline if timeline > 0 else 0
                return f"""{user_name}, для благородной цели Хаджа:

🎯 ЦЕЛЬ: {target:,} ₸ за {timeline} месяцев
• Ежемесячно: {monthly_saving:,.0f} ₸
• Это {monthly_saving/monthly_income*100:.1f}% от дохода

🕌 РЕКОМЕНДАЦИИ:
1. Открыть целевой счет Мудараба
2. Автоматизировать переводы
3. Рассмотреть дополнительные источники дохода
4. Участвовать в благотворительности во время подготовки

ИншаАллах, ваше намерение будет принято!"""
            else:
                return f"{user_name}, для накопления на Хадж рекомендую начать с {max(62500, monthly_income * 0.15):,.0f} ₸ в месяц. Это благородная цель, которая требует финансовой подготовки. Хотите поставить эту цель?"

        elif any(word in user_message_lower for word in ['экономия', 'траты', 'расходы', 'сэкономить']):
            potential_savings = monthly_expenses * 0.15  # 15% от расходов можно сэкономить
            return f"""{user_name}, анализ ваших расходов {monthly_expenses:,} ₸/месяц:

💡 ПОТЕНЦИАЛ ЭКОНОМИИ: {potential_savings:,.0f} ₸/месяц

🎯 КОНКРЕТНЫЕ СОВЕТЫ:

1. ПИТАНИЕ ({monthly_expenses * 0.25:,.0f} ₸):
   • Готовьте дома - экономия до 30%
   • Планируйте меню на неделю
   • Покупайте оптом

2. ТРАНСПОРТ ({monthly_expenses * 0.15:,.0f} ₸):
   • Используйте общественный транспорт
   • Карпулинг с коллегами
   • Планируйте поездки

3. РАЗВЛЕЧЕНИЯ ({monthly_expenses * 0.1:,.0f} ₸):
   • Бесплатные мероприятия
   • Семейные вечера вместо ресторанов
   • Хобби вместо шопинга

💰 ОБЩАЯ ЭКОНОМИЯ: {potential_savings:,.0f} ₸/месяц = {potential_savings * 12:,.0f} ₸/год"""

        elif any(word in user_message_lower for word in ['стресс', 'нервы', 'успокои', 'покупк']):
            return f"""{user_name}, вместо шопинга от стресса рекомендую:

🌙 ДУХОВНЫЕ ПРАКТИКИ:
• Намаз и дуа - успокаивает душу
• Чтение Корана - источник tranquility
• Зикр - поминание Аллаха

👨‍👩‍👧‍👦 СОЦИАЛЬНЫЕ АКТИВНОСТИ:
• Время с семьей - бесценно
• Помощь родителям
• Встречи с друзьями

🎯 РАЗВИТИЕ:
• Спорт и физическая активность
• Изучение новых навыков
• Волонтерство

💡 Психологический эффект: эти активности дают долгосрочное удовлетворение вместо временного удовольствия от покупок."""

        elif any(word in user_message_lower for word in ['инвестиц', 'вложить', 'приумнож']):
            investment_amount = monthly_income * 0.15
            return f"""{user_name}, для инвестиций в соответствии с шариатом:

💰 ДОСТУПНАЯ СУММА: {investment_amount:,.0f} ₸/месяц

🏦 ИСЛАМСКИЕ ИНСТРУМЕНТЫ:

1. МУДАРАБА (Сбережения):
   • Участие в прибыли банка
   • Без гарантированного процента
   • От {max(50000, investment_amount * 3):,.0f} ₸

2. МУШАРАКА (Бизнес):
   • Совместное предпринимательство  
   • Разделение прибылей и убытков
   • От {max(500000, investment_amount * 12):,.0f} ₸

3. МУРАБАХА (Торговля):
   • Финансирование торговых операций
   • Фиксированная наценка
   • От {max(100000, investment_amount * 6):,.0f} ₸

🎯 РЕКОМЕНДАЦИЯ: Начните с Мудараба на {investment_amount:,.0f} ₸/месяц"""

        elif any(word in user_message_lower for word in ['закят', 'благотворительность', 'садака']):
            zakat_amount = monthly_income * 12 * 0.025  # Годовой закят
            return f"""{user_name}, по вашем доходу {monthly_income:,} ₸/месяц:

📊 РАСЧЕТ ЗАКЯТА:
• Годовой доход: {monthly_income * 12:,} ₸
• Годовой закят: {zakat_amount:,.0f} ₸
• Ежемесячно: {zakat_amount/12:,.0f} ₸

🎯 КАК ВЫПЛАЧИВАТЬ:
1. Ежегодно одной суммой
2. Ежемесячно по {zakat_amount/12:,.0f} ₸
3. В Рамадан для большего воздаяния

📈 КУДА НАПРАВИТЬ:
• Близким родственникам в нужде
• Местной мечети или исламскому центру
• Благотворительным организациям
• Образовательным проектам

💡 САДАКА: Кроме закята, регулярная садака очищает имущество и приносит баракат."""

        elif any(word in user_message_lower for word in ['бюджет', 'планирован', 'распределен']):
            return f"""{user_name}, создаем бюджет по исламским принципам:

📊 ВАШ ДОХОД: {monthly_income:,} ₸/месяц

🎯 РЕКОМЕНДУЕМОЕ РАСПРЕДЕЛЕНИЕ:

1. ОСНОВНЫЕ НУЖДЫ (50%): {monthly_income * 0.5:,.0f} ₸
   • Жилье, питание, транспорт, здоровье

2. СБЕРЕЖЕНИЯ (20%): {monthly_income * 0.2:,.0f} ₸  
   • Финансовые цели
   • Чрезвычайный фонд

3. ИНВЕСТИЦИИ (15%): {monthly_income * 0.15:,.0f} ₸
   • Реальный бизнес
   • Саморазвитие

4. ЗАКЯТ (2.5%): {monthly_income * 0.025:,.0f} ₸
   • Обязательная благотворительность

5. РАЗВИТИЕ (12.5%): {monthly_income * 0.125:,.0f} ₸
   • Образование, навыки, здоровье

💡 Этот баланс обеспечит успех в дунье и ахирате!"""

        # Общий персонализированный ответ
        goals_count = len(goals)
        total_goals_amount = sum(goal.get('target_amount', 0) for goal in goals)
        
        return f"""Ассаламу алейкум, {user_name}! 

📊 ВАШ ФИНАНСОВЫЙ ПРОФИЛЬ:
• Возраст: {age} лет
• Доход: {monthly_income:,} ₸/месяц
• Активные цели: {goals_count} на сумму {total_goals_amount:,} ₸

🎯 ПЕРСОНАЛИЗИРОВАННЫЕ РЕКОМЕНДАЦИИ:

1. УПРАВЛЕНИЕ БЮДЖЕТОМ:
   Оптимизируйте расходы {monthly_expenses:,} ₸ для увеличения сбережений

2. ДОСТИЖЕНИЕ ЦЕЛЕЙ:
   Ежемесячно откладывайте {max(monthly_income * 0.2, total_goals_amount/60):,.0f} ₸

3. ИСЛАМСКИЕ ИНВЕСТИЦИИ:
   Рассмотрите Мудараба на {monthly_income * 0.15:,.0f} ₸/месяц

4. СОЦИАЛЬНАЯ ОТВЕТСТВЕННОСТЬ:
   Выделяйте {monthly_income * 0.025:,.0f} ₸ на закят

💡 Чем конкретно могу помочь в вашей финансовой ситуации?"""

    def create_financial_plan(self, user_profile: Dict[str, Any], goals: List[Dict]) -> Dict[str, Any]:
        """Создание персонализированного исламского финансового плана"""
        monthly_income = user_profile.get('monthly_income', 0)
        monthly_expenses = user_profile.get('monthly_expenses', 0)
        age = user_profile.get('age', 0)
        
        # Расчет реальных данных на основе профиля пользователя
        total_goals_amount = sum(goal.get('target_amount', 0) for goal in goals)
        avg_goal_timeline = sum(goal.get('timeline_months', 12) for goal in goals) / max(len(goals), 1)
        monthly_savings_needed = total_goals_amount / avg_goal_timeline if avg_goal_timeline > 0 else 0
        
        plan = {
            "monthly_plan": {
                "essential_spending": monthly_income * 0.5,
                "current_expenses": monthly_expenses,
                "savings": min(monthly_income * 0.2, monthly_savings_needed),
                "investments": monthly_income * 0.15,
                "charity": monthly_income * 0.025,
                "personal_development": monthly_income * 0.125
            },
            "recommendations": [
                f"Оптимизируйте расходы с {monthly_expenses:,} ₸ до {monthly_income * 0.5:,.0f} ₸",
                f"Целевые сбережения: {monthly_savings_needed:,.0f} ₸/месяц для {len(goals)} целей",
                f"Инвестируйте {monthly_income * 0.15:,.0f} ₸/месяц в реальный сектор",
                f"Выделяйте {monthly_income * 0.025:,.0f} ₸/месяц на закят"
            ],
            "islamic_products": ["Мудараба Сберегательный", "Мурабаха Жилье", "Мушарака Бизнес"],
            "risk_assessment": user_profile.get('risk_profile', 'moderate'),
            "timeline_analysis": f"В {age} лет у вас отличный потенциал для роста. С доходом {monthly_income:,} ₸ вы можете достичь целей за {avg_goal_timeline:.0f} месяцев при следовании исламским принципам."
        }
        
        return plan

    def analyze_spending_habits(self, transactions: List[Dict], user_profile: Dict) -> Dict[str, Any]:
        """Анализ привычек расходов с исламской перспективой"""
        monthly_income = user_profile.get('monthly_income', 0)
        monthly_expenses = user_profile.get('monthly_expenses', 0)
        
        analysis = {
            "spending_analysis": {
                "monthly_income": monthly_income,
                "monthly_expenses": monthly_expenses,
                "savings": monthly_income - monthly_expenses,
                "savings_rate": (monthly_income - monthly_expenses) / monthly_income if monthly_income > 0 else 0,
                "essential_spending": monthly_expenses * 0.6,
                "discretionary_spending": monthly_expenses * 0.4
            },
            "habits_to_improve": [
                f"Сократите расходы на {monthly_expenses - monthly_income * 0.5:,.0f} ₸ для баланса",
                "Планируйте крупные покупки согласно исламскому бюджету",
                "Увеличьте благотворительные взносы до 2.5% от дохода"
            ],
            "islamic_recommendations": [
                f"Выделяйте {monthly_income * 0.025:,.0f} ₸ на закят ежемесячно",
                "Избегайте излишеств (исраф) в расходах на развлечения",
                "Инвестируйте в реальный сектор экономики вместо спекуляций"
            ],
            "charity_suggestions": [
                f"Регулярная садака от {monthly_income * 0.01:,.0f} ₸/месяц",
                "Поддержка местных мечетей и исламских учебных заведений",
                "Помощь нуждающимся членам общины"
            ],
            "stress_alternatives": [
                "Намаз и дуа для духовного успокоения",
                "Чтение Корана и исламской литературы", 
                "Семейное время и общение с близкими",
                "Прогулки на природе и физическая активность",
                "Волонтерство и помощь другим"
            ]
        }
        
        return analysis

    def recommend_products(self, user_goals: List[Dict], user_profile: Dict) -> List[Dict[str, Any]]:
        """Рекомендация исламских финансовых продуктов на основе реальных целей"""
        monthly_income = user_profile.get('monthly_income', 0)
        recommended_products = []
        
        # Базовые продукты для всех пользователей
        recommended_products.append({
            "product_id": "mudaraba_savings",
            "name": "Мудараба Сберегательный", 
            "type": "deposit",
            "suitable_for": "Регулярные сбережения и накопления",
            "min_amount": max(50000, monthly_income * 0.1),
            "max_amount": 10000000,
            "description": "Участие в прибыли банка без фиксированного процента. Идеально для накопления на различные цели.",
            "sharia_compliant": True,
            "estimated_monthly": monthly_income * 0.15,
            "features": ["Участие в прибыли", "Без гарантированного процента", "Соответствует шариату", "Гибкие взносы"]
        })
        
        for goal in user_goals:
            goal_amount = goal.get('target_amount', 0)
            timeline = goal.get('timeline_months', 12)
            category = goal.get('category', 'other')
            monthly_saving = goal_amount / timeline if timeline > 0 else 0
            
            if category == 'housing' and goal_amount > 1000000:
                recommended_products.append({
                    "product_id": "murabaha_housing",
                    "name": "Мурабаха Жилье",
                    "type": "credit",
                    "suitable_for": "Покупка недвижимости",
                    "min_amount": 1000000,
                    "max_amount": 50000000,
                    "description": f"Финансирование с фиксированной наценкой для покупки жилья за {goal_amount:,} ₸. Без процентов, прозрачные условия.",
                    "sharia_compliant": True,
                    "estimated_monthly": monthly_saving,
                    "features": ["Без риба", "Прозрачная наценка", f"Рассрочка до {timeline} месяцев", "Страхование ТАКАФУЛ"]
                })
            
            elif category == 'business' and goal_amount > 500000:
                recommended_products.append({
                    "product_id": "musharaka_business", 
                    "name": "Мушарака Бизнес",
                    "type": "investment",
                    "suitable_for": "Начало или развитие бизнеса",
                    "min_amount": 500000,
                    "max_amount": 50000000,
                    "description": f"Совместное предпринимательство для бизнеса с бюджетом {goal_amount:,} ₸. Реальное партнерство с разделением прибыли.",
                    "sharia_compliant": True,
                    "estimated_monthly": monthly_saving,
                    "features": ["Совместное владение", "Разделение рисков", "Активное участие", "Профессиональная поддержка"]
                })
            
            elif category == 'hajj':
                recommended_products.append({
                    "product_id": "hajj_savings",
                    "name": "Накопление на Хадж",
                    "type": "special",
                    "suitable_for": "Подготовка к Хаджу",
                    "min_amount": 50000,
                    "max_amount": goal_amount,
                    "description": f"Специальная программа для накопления {goal_amount:,} ₸ на благородную цель Хаджа. Отдельный счет с духовным сопровождением.",
                    "sharia_compliant": True,
                    "estimated_monthly": monthly_saving,
                    "features": ["Целевой счет", "Духовное сопровождение", "Консультации по Хаджу", "Гибкий график накоплений"]
                })
        
        return recommended_products

    def chat_with_context(self, user_message: str, user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Умный чат с учетом контекста пользователя"""
        # Всегда используем mock ответы с улучшенной персонализацией
        ai_response = self.get_mock_response(user_message, user_context)
        
        # Генерация дополнительных рекомендаций
        recommendations = self._extract_recommendations(ai_response)
        products = self.recommend_products(user_context.get('goals', []), user_context)
        
        return {
            "response": ai_response,
            "recommendations": recommendations,
            "suggested_products": products[:3],
            "message_type": "financial_advice"
        }

    def _extract_recommendations(self, response: str) -> List[str]:
        """Извлечение рекомендаций из ответа"""
        recommendations = []
        lines = response.split('\n')
        
        for line in lines:
            line = line.strip()
            if (line.startswith('• ') or line.startswith('- ') or 
                (line.startswith('1. ') or line.startswith('2. ') or line.startswith('3. ')) and
                len(line) < 200 and not line.startswith('📊') and not line.startswith('🎯')):
                clean_line = line[2:].strip() if line.startswith('• ') else line[3:].strip()
                if clean_line and len(clean_line) > 10:
                    recommendations.append(clean_line)
        
        # Если не нашли рекомендаций, создаем общие
        if not recommendations:
            recommendations = [
                "Создайте бюджет согласно исламским принципам распределения",
                "Регулярно откладывайте 20% дохода на сбережения",
                "Выделяйте 2.5% на закят для очищения имущества"
            ]
        
        return recommendations[:4]

# Глобальный экземпляр сервиса
islamic_ai_service = IslamicAIService()