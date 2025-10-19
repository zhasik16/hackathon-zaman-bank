import logging
import json
import requests
from typing import Dict, List, Any, Optional
from ..core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IslamicAIService:
    def __init__(self):
        self.base_url = "https://openai-hub.neuraldeep.tech"
        self.api_key = "sk-roG30usRr0TLCHAADks6lw"
        
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

    async def get_ai_response(self, messages: List[Dict[str, str]], model: str = "gpt-4o-mini") -> str:
        """Используем реальную GPT-4o-mini модель для ответов"""
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": 1000,
                "temperature": 0.7,
                "top_p": 0.9
            }
            
            response = requests.post(
                f"{self.base_url}/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                logger.error(f"API Error: {response.status_code} - {response.text}")
                return self._get_fallback_response(messages)
                
        except Exception as e:
            logger.error(f"Error calling AI API: {e}")
            return self._get_fallback_response(messages)

    async def transcribe_audio(self, audio_file) -> str:
        """Транскрибация голоса через Whisper API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            files = {
                "file": audio_file,
                "model": (None, "whisper-1"),
                "language": (None, "ru"),
                "response_format": (None, "json")
            }
            
            response = requests.post(
                f"{self.base_url}/v1/audio/transcriptions",
                headers=headers,
                files=files,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["text"]
            else:
                logger.error(f"Whisper API Error: {response.status_code}")
                return "Не удалось распознать голосовое сообщение"
                
        except Exception as e:
            logger.error(f"Error calling Whisper API: {e}")
            return "Ошибка при обработке голосового сообщения"

    def _get_fallback_response(self, messages: List[Dict[str, str]]) -> str:
        """Резервный ответ если API недоступно"""
        user_message = messages[-1]["content"] if messages else ""
        user_message_lower = user_message.lower()
        
        if any(word in user_message_lower for word in ['привет', 'салам', 'здравств']):
            return "Ассаламу алейкум! Я ваш персональный помощник Zaman Bank. К сожалению, в данный момент AI сервис временно недоступен. Пожалуйста, попробуйте позже или используйте основные функции приложения."
        
        return "Извините, AI сервис временно недоступен. Пожалуйста, попробуйте позже или обратитесь в поддержку."

    async def get_chat_response(self, user_message: str, user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Основной метод для получения умных ответов с контекстом"""
        
        # Создаем умный system prompt на основе контекста пользователя
        system_prompt = self._create_system_prompt(user_context)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        try:
            # Используем реальную AI модель
            ai_response = await self.get_ai_response(messages)
            
            # Извлекаем рекомендации и продукты
            recommendations = await self._extract_recommendations(ai_response, user_context)
            suggested_products = await self._suggest_products(user_context, user_message)
            
            return {
                "response": ai_response,
                "recommendations": recommendations,
                "suggested_products": suggested_products,
                "transcribed_text": None,  # Для текстовых сообщений
                "message_type": "financial_advice"
            }
            
        except Exception as e:
            logger.error(f"Error in get_chat_response: {e}")
            return {
                "response": "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
                "recommendations": ["Проверьте подключение к интернету", "Попробуйте переформулировать вопрос"],
                "suggested_products": [],
                "transcribed_text": None,
                "message_type": "error"
            }

    async def get_voice_response(self, audio_file, user_context: Dict[str, Any]) -> Dict[str, Any]:
        """Обработка голосовых сообщений"""
        try:
            # Транскрибируем голос
            transcribed_text = await self.transcribe_audio(audio_file)
            
            if transcribed_text and "не удалось" not in transcribed_text.lower():
                # Получаем ответ на транскрибированный текст
                chat_response = await self.get_chat_response(transcribed_text, user_context)
                chat_response["transcribed_text"] = transcribed_text
                return chat_response
            else:
                return {
                    "response": "Извините, не удалось распознать ваше голосовое сообщение. Пожалуйста, попробуйте еще раз или напишите текстом.",
                    "recommendations": ["Говорите четко и в спокойной обстановке", "Используйте текстовый ввод для сложных вопросов"],
                    "suggested_products": [],
                    "transcribed_text": transcribed_text,
                    "message_type": "voice_error"
                }
                
        except Exception as e:
            logger.error(f"Error in get_voice_response: {e}")
            return {
                "response": "Ошибка при обработке голосового сообщения. Пожалуйста, попробуйте еще раз.",
                "recommendations": [],
                "suggested_products": [],
                "transcribed_text": None,
                "message_type": "error"
            }

    def _create_system_prompt(self, user_context: Dict[str, Any]) -> str:
        """Создание умного system prompt на основе контекста пользователя"""
        
        user_name = user_context.get('username', 'уважаемый клиент')
        monthly_income = user_context.get('monthly_income', 0)
        monthly_expenses = user_context.get('monthly_expenses', 0)
        goals = user_context.get('goals', [])
        age = user_context.get('age', 0)
        risk_profile = user_context.get('risk_profile', 'moderate')
        
        goals_info = ""
        if goals:
            goals_list = [f"- {goal.get('name', 'Цель')}: {goal.get('target_amount', 0):,} ₸ за {goal.get('timeline_months', 12)} месяцев" 
                         for goal in goals[:5]]
            goals_info = "\n".join(goals_list)
        
        system_prompt = f"""
        Ты - персональный финансовый советник Zaman Bank, специализирующийся на исламских финансах. 
        Твоя задача - предоставлять профессиональные, точные и полезные финансовые консультации 
        в соответствии с принципами шариата.

        КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
        Имя: {user_name}
        Возраст: {age}
        Ежемесячный доход: {monthly_income:,} ₸
        Ежемесячные расходы: {monthly_expenses:,} ₸
        Профиль риска: {risk_profile}
        
        ФИНАНСОВЫЕ ЦЕЛИ:
        {goals_info if goals_info else "Цели не установлены"}

        ТВОИ ПРИНЦИПЫ:
        1. Всегда предлагай только халяльные финансовые решения
        2. Избегай любых упоминаний о процентах (риба)
        3. Будь добрым, понимающим и профессиональным
        4. Предоставляй конкретные, практические рекомендации
        5. Учитывай индивидуальные обстоятельства пользователя
        6. Объясняй исламские финансовые концепции простым языком
        7. Всегда предлагай несколько вариантов решений

        РАЗРЕШЕННЫЕ ФИНАНСОВЫЕ ИНСТРУМЕНТЫ:
        - Мурабаха (продажа с наценкой)
        - Мудараба (партнерство с разделением прибыли)
        - Мушарака (совместное предприятие)
        - Иджара (аренда)
        - Истисна (производственное финансирование)

        ВАЖНЫЕ КОНЦЕПЦИИ:
        - Закят (2.5% от сбережений)
        - Садака (добровольная благотворительность)
        - Вакаф (благотворительный фонд)
        - Отсутствие гарара (неопределенности)

        ТВОЙ СТИЛЬ:
        - Профессиональный, но дружелюбный
        - Мотивирующий и поддерживающий
        - Конкретный и практичный
        - Культурно чувствительный
        - Вселяющий уверенность

        Отвечай на русском языке, используя эмодзи для лучшей визуализации.
        Всегда заканчивай ответ открытым вопросом для продолжения диалога.
        """
        
        return system_prompt

    async def _extract_recommendations(self, response: str, user_context: Dict[str, Any]) -> List[str]:
        """Извлечение рекомендаций из AI ответа"""
        try:
            # Используем AI для извлечения структурированных рекомендаций
            extraction_prompt = f"""
            Извлеки 3-4 конкретные рекомендации из следующего текста. 
            Рекомендации должны быть краткими, практичными и ориентированными на действие.
            Верни ТОЛЬКО список рекомендаций в формате JSON массива.

            Текст: {response}

            Верни только JSON массив, ничего больше.
            """
            
            messages = [
                {"role": "system", "content": "Ты помощник для извлечения структурированных рекомендаций. Возвращай только JSON."},
                {"role": "user", "content": extraction_prompt}
            ]
            
            extraction_response = await self.get_ai_response(messages)
            
            # Пытаемся распарсить JSON
            try:
                recommendations = json.loads(extraction_response)
                if isinstance(recommendations, list) and len(recommendations) > 0:
                    return recommendations[:4]
            except:
                pass
                
            # Fallback: простой парсинг по строкам
            recommendations = []
            lines = response.split('\n')
            for line in lines:
                line = line.strip()
                if (line.startswith('• ') or line.startswith('- ') or 
                    (line.startswith('1. ') or line.startswith('2. ') or line.startswith('3. ') or line.startswith('4. ')) and
                    len(line) < 150):
                    clean_line = line[2:].strip() if line.startswith('• ') else line[3:].strip()
                    if clean_line and len(clean_line) > 10 and not clean_line.startswith('📊') and not clean_line.startswith('🎯'):
                        recommendations.append(clean_line)
            
            return recommendations[:4] if recommendations else [
                "Регулярно отслеживайте свои расходы",
                "Создайте бюджет согласно исламским принципам",
                "Выделяйте 2.5% от сбережений на закят"
            ]
            
        except Exception as e:
            logger.error(f"Error extracting recommendations: {e}")
            return [
                "Создайте детальный финансовый план",
                "Регулярно откладывайте 20% дохода",
                "Инвестируйте в соответствии с принципами шариата"
            ]

    async def _suggest_products(self, user_context: Dict[str, Any], user_message: str) -> List[Dict[str, Any]]:
        """Умная рекомендация продуктов на основе контекста"""
        try:
            monthly_income = user_context.get('monthly_income', 0)
            goals = user_context.get('goals', [])
            user_message_lower = user_message.lower()
            
            # Используем AI для анализа и рекомендации продуктов
            analysis_prompt = f"""
            Проанализируй финансовый профиль пользователя и его запрос, чтобы рекомендовать подходящие исламские финансовые продукты.

            ПРОФИЛЬ:
            - Доход: {monthly_income:,} ₸/месяц
            - Цели: {[goal.get('name', 'Цель') for goal in goals]}
            - Запрос: {user_message}

            ДОСТУПНЫЕ ПРОДУКТЫ ZAMAN BANK:
            1. Вклад "Аманат" (Мудараба) - для сбережений
            2. Мурабаха финансирование - для недвижимости, автомобилей
            3. Мушарака бизнес - для предпринимательства
            4. Иджара - лизинг с выкупом
            5. Текущий счет "Вадиа" - для ежедневных операций
            6. Инвестиционный счет "Садака" - для социальных инвестиций

            Верни ТОЛЬКО JSON массив с 2-3 наиболее подходящими продуктами в формате:
            [{{"name": "Название", "type": "Тип", "description": "Краткое описание", "why_suitable": "Почему подходит"}}]

            Будь конкретным и ориентированным на потребности пользователя.
            """
            
            messages = [
                {"role": "system", "content": "Ты помощник для рекомендации финансовых продуктов. Возвращай только JSON."},
                {"role": "user", "content": analysis_prompt}
            ]
            
            products_response = await self.get_ai_response(messages)
            
            try:
                suggested_products = json.loads(products_response)
                if isinstance(suggested_products, list):
                    return suggested_products[:3]
            except:
                pass
                
            # Fallback рекомендации
            return self._get_fallback_products(user_context, user_message_lower)
            
        except Exception as e:
            logger.error(f"Error suggesting products: {e}")
            return self._get_fallback_products(user_context, user_message.lower())

    def _get_fallback_products(self, user_context: Dict[str, Any], user_message_lower: str) -> List[Dict[str, Any]]:
        """Резервные рекомендации продуктов"""
        monthly_income = user_context.get('monthly_income', 0)
        goals = user_context.get('goals', [])
        
        base_products = [
            {
                "name": "Вклад 'Аманат'",
                "type": "сбережения",
                "description": "Исламский сберегательный счет с участием в прибыли банка",
                "why_suitable": "Для регулярных накоплений и создания финансовой подушки"
            }
        ]
        
        if any(word in user_message_lower for word in ['жилье', 'квартир', 'дом', 'недвижимость']):
            base_products.append({
                "name": "Мурабаха Жилье",
                "type": "финансирование", 
                "description": "Финансирование покупки недвижимости без процентов",
                "why_suitable": "Прозрачные условия для приобретения жилья"
            })
        
        if any(word in user_message_lower for word in ['бизнес', 'предпринимательство', 'стартап']):
            base_products.append({
                "name": "Мушарака Бизнес",
                "type": "инвестиции",
                "description": "Совместное предпринимательство с разделением прибыли",
                "why_suitable": "Реальное партнерство для развития бизнеса"
            })
        
        if any(word in user_message_lower for word in ['автомобиль', 'машина', 'транспорт']):
            base_products.append({
                "name": "Иджара Авто", 
                "type": "лизинг",
                "description": "Лизинг автомобиля с правом выкупа",
                "why_suitable": "Гибкие условия для приобретения транспорта"
            })
        
        return base_products[:3]

    async def create_financial_plan(self, user_profile: Dict[str, Any], goals: List[Dict]) -> Dict[str, Any]:
        """Создание умного финансового плана с использованием AI"""
        try:
            plan_prompt = f"""
            Создай детальный исламский финансовый план на основе профиля пользователя.

            ПРОФИЛЬ:
            - Возраст: {user_profile.get('age', 0)}
            - Доход: {user_profile.get('monthly_income', 0):,} ₸/месяц
            - Расходы: {user_profile.get('monthly_expenses', 0):,} ₸/месяц
            - Профиль риска: {user_profile.get('risk_profile', 'moderate')}
            - Цели: {[f"{goal.get('name')}: {goal.get('target_amount', 0):,} ₸ за {goal.get('timeline_months', 12)} месяцев" for goal in goals]}

            Создай план в формате JSON с полями:
            - monthly_budget (распределение по категориям)
            - savings_strategy (стратегия накоплений) 
            - investment_recommendations (инвестиционные рекомендации)
            - islamic_considerations (исламские аспекты)
            - timeline (график достижения целей)

            Будь конкретным и практичным.
            """
            
            messages = [
                {"role": "system", "content": "Ты финансовый планировщик. Возвращай только JSON."},
                {"role": "user", "content": plan_prompt}
            ]
            
            plan_response = await self.get_ai_response(messages)
            
            try:
                return json.loads(plan_response)
            except:
                return self._create_basic_plan(user_profile, goals)
                
        except Exception as e:
            logger.error(f"Error creating financial plan: {e}")
            return self._create_basic_plan(user_profile, goals)

    def _create_basic_plan(self, user_profile: Dict[str, Any], goals: List[Dict]) -> Dict[str, Any]:
        """Базовый финансовый план как fallback"""
        monthly_income = user_profile.get('monthly_income', 0)
        monthly_expenses = user_profile.get('monthly_expenses', 0)
        
        return {
            "monthly_budget": {
                "essential_needs": monthly_income * 0.5,
                "savings": monthly_income * 0.2,
                "investments": monthly_income * 0.15,
                "charity": monthly_income * 0.025,
                "personal_development": monthly_income * 0.125
            },
            "savings_strategy": "Регулярные отчисления 20% от дохода",
            "investment_recommendations": ["Мудараба сберегательный счет", "Социальные инвестиции"],
            "islamic_considerations": ["Соблюдение принципов шариата", "Регулярный закят", "Избегание риба"],
            "timeline": "Поэтапное достижение целей в течение 12-60 месяцев"
        }

# Глобальный экземпляр сервиса
islamic_ai_service = IslamicAIService()