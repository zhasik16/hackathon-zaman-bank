# app/routers/products.py

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/v1/products", tags=["products"])

# Pydantic Models
class BankProduct(BaseModel):
    id: int
    name: str
    type: str  # "deposit", "financing", "investment", "savings", "card"
    description: str
    features: List[str]
    islamic_compliant: bool
    risk_level: str  # "low", "medium", "high"
    min_amount: Optional[int] = None
    max_amount: Optional[int] = None
    timeline: Optional[str] = None
    recommended_for: List[str]
    sharia_principles: List[str]
    eligibility: List[str]
    profit_rate: Optional[str] = None
    monthly_payment: Optional[int] = None

class ProductRecommendationRequest(BaseModel):
    user_goals: List[str]
    risk_profile: str
    monthly_income: Optional[int] = None
    investment_amount: Optional[int] = None
    timeline: Optional[str] = None

class ProductApplication(BaseModel):
    product_id: int
    user_id: int
    amount: int
    timeline: Optional[str] = None
    additional_info: Optional[str] = None

class ProductComparisonRequest(BaseModel):
    product_ids: List[int]

# Mock database (replace with actual database in production)
products_db = [
    {
        "id": 1,
        "name": "Вклад 'Аманат'",
        "type": "deposit",
        "description": "Исламский беспроцентный вклад с участием в прибыли банка. Соответствует принципам Мудараба.",
        "features": [
            "Отсутствие рибы (процентов)",
            "Участие в прибыли банка",
            "Страхование в АСВ",
            "Капитализация доходов",
            "Досрочное снятие возможно"
        ],
        "islamic_compliant": True,
        "risk_level": "low",
        "min_amount": 50000,
        "timeline": "3-36 месяцев",
        "recommended_for": ["Сбережения", "Краткосрочные цели", "Создание финансовой подушки"],
        "sharia_principles": ["Мудараба", "Отсутствие рибы"],
        "eligibility": ["Физические лица", "Резиденты РК", "От 18 лет"],
        "profit_rate": "До 12% годовых (участие в прибыли)"
    },
    {
        "id": 2,
        "name": "Мурабаха финансирование недвижимости",
        "type": "financing",
        "description": "Приобретение жилой недвижимости через механизм перепродажи с согласованной наценкой.",
        "features": [
            "Фиксированная стоимость",
            "Прозрачные условия",
            "Рассрочка до 20 лет",
            "Первоначальный взвод от 15%",
            "Страхование объекта"
        ],
        "islamic_compliant": True,
        "risk_level": "medium",
        "min_amount": 5000000,
        "max_amount": 50000000,
        "timeline": "до 20 лет",
        "recommended_for": ["Покупка квартиры", "Приобретение дома", "Ипотека"],
        "sharia_principles": ["Мурабаха", "Отсутствие процентов"],
        "eligibility": ["Физические лица", "Постоянный доход", "Хорошая кредитная история"],
        "monthly_payment": "Рассчитывается индивидуально"
    },
    {
        "id": 3,
        "name": "Иджара автомобильное финансирование",
        "type": "financing",
        "description": "Лизинг автомобиля с последующим выкупом по остаточной стоимости. Аренда с правом выкупа.",
        "features": [
            "Аренда с выкупом",
            "Низкий первоначальный платеж",
            "Страхование включено",
            "Обслуживание у дилера",
            "Досрочный выкуп"
        ],
        "islamic_compliant": True,
        "risk_level": "medium",
        "min_amount": 3000000,
        "timeline": "1-7 лет",
        "recommended_for": ["Покупка автомобиля", "Бизнес-транспорт", "Семейный автомобиль"],
        "sharia_principles": ["Иджара", "Лизинг с выкупом"],
        "eligibility": ["Физические и юридические лица", "Подтверждение дохода"],
        "monthly_payment": "Рассчитывается индивидуально"
    },
    {
        "id": 4,
        "name": "Инвестиционный счет 'Садака'",
        "type": "investment",
        "description": "Социально ответственные инвестиции в халяльные секторы экономики с экспертным управлением.",
        "features": [
            "Диверсификация портфеля",
            "Экспертное управление",
            "Ежеквартальные отчеты",
            "Социальная ответственность",
            "Часть прибыли на благотворительность"
        ],
        "islamic_compliant": True,
        "risk_level": "medium",
        "min_amount": 100000,
        "recommended_for": ["Долгосрочные инвестиции", "Пенсионные накопления", "Социальные проекты"],
        "sharia_principles": ["Мудараба", "Социальная ответственность"],
        "eligibility": ["Резиденты РК", "От 18 лет", "Инвестиционный профиль"],
        "profit_rate": "Зависит от результатов инвестирования"
    },
    {
        "id": 5,
        "name": "Текущий счет 'Вадиа'",
        "type": "savings",
        "description": "Беспроцентный текущий счет для ежедневных операций с гарантией сохранности средств.",
        "features": [
            "Бесплатное обслуживание",
            "Онлайн-банкинг",
            "Мобильное приложение",
            "Бесплатные переводы",
            "Страхование средств"
        ],
        "islamic_compliant": True,
        "risk_level": "low",
        "min_amount": 0,
        "recommended_for": ["Ежедневные операции", "Зарплатные проекты", "Управление личными финансами"],
        "sharia_principles": ["Вадиа", "Без рибы"],
        "eligibility": ["Физические лица", "Резиденты РК", "От 14 лет"]
    },
    {
        "id": 6,
        "name": "Карта 'Рахмат'",
        "type": "card",
        "description": "Дебетовая карта с кэшбэком и специальными предложениями от партнеров банка.",
        "features": [
            "Кэшбэк до 5%",
            "Бесплатное обслуживание",
            "Скидки у партнеров",
            "Мобильные платежи",
            "Страхование покупок"
        ],
        "islamic_compliant": True,
        "risk_level": "low",
        "recommended_for": ["Ежедневные покупки", "Онлайн-шоппинг", "Путешествия"],
        "sharia_principles": ["Отсутствие процентов", "Партнерские программы"],
        "eligibility": ["Владельцы текущих счетов", "От 18 лет"]
    },
    {
        "id": 7,
        "name": "Образовательное финансирование",
        "type": "financing",
        "description": "Финансирование образования в вузах РК и за рубежом по исламским принципам.",
        "features": [
            "Финансирование до 100% стоимости",
            "Льготный период погашения",
            "Гибкий график платежей",
            "Страхование обучения",
            "Поддержка трудоустройства"
        ],
        "islamic_compliant": True,
        "risk_level": "medium",
        "min_amount": 500000,
        "timeline": "до 10 лет",
        "recommended_for": ["Высшее образование", "Магистратура", "Профессиональные курсы"],
        "sharia_principles": ["Мурабаха", "Социальная поддержка"],
        "eligibility": ["Студенты", "Абитуриенты", "При зачислении в вуз"],
        "monthly_payment": "Рассчитывается индивидуально"
    },
    {
        "id": 8,
        "name": "Медицинское финансирование",
        "type": "financing",
        "description": "Финансирование медицинских услуг, операций и лечения в клиниках Казахстана и за рубежом.",
        "features": [
            "Широкий список клиник",
            "Экспресс-одобрение",
            "Страхование лечения",
            "Сопровождение",
            "Гибкие условия"
        ],
        "islamic_compliant": True,
        "risk_level": "medium",
        "min_amount": 300000,
        "timeline": "до 5 лет",
        "recommended_for": ["Плановые операции", "Стоматология", "Реабилитация", "Чекапы"],
        "sharia_principles": ["Мурабаха", "Социальная поддержка"],
        "eligibility": ["Физические лица", "Медицинские показания"],
        "monthly_payment": "Рассчитывается индивидуально"
    }
]

applications_db = []
product_views_db = []

# Helper functions
def get_product_by_id(product_id: int) -> Optional[dict]:
    return next((product for product in products_db if product["id"] == product_id), None)

def calculate_monthly_payment(product: dict, amount: int, timeline_months: int) -> int:
    """Calculate estimated monthly payment for financing products"""
    if product["type"] != "financing":
        return 0
    
    # Simple calculation - in real scenario, this would use proper Islamic finance formulas
    markup_rate = 0.15  # 15% markup for Murabaha
    total_amount = amount * (1 + markup_rate)
    return int(total_amount / timeline_months)

def recommend_products(user_goals: List[str], risk_profile: str, monthly_income: Optional[int] = None) -> List[dict]:
    """Recommend products based on user goals and risk profile"""
    recommended = []
    
    for product in products_db:
        score = 0
        
        # Match goals
        for goal in user_goals:
            if any(goal.lower() in rec.lower() for rec in product["recommended_for"]):
                score += 2
        
        # Match risk profile
        risk_mapping = {
            "conservative": ["low"],
            "moderate": ["low", "medium"],
            "aggressive": ["low", "medium", "high"]
        }
        if risk_profile in risk_mapping and product["risk_level"] in risk_mapping[risk_profile]:
            score += 1
        
        # Consider income for financing products
        if monthly_income and product["type"] == "financing":
            if monthly_income > 300000:  # Good income for financing
                score += 1
        
        if score > 0:
            recommended.append({**product, "match_score": score})
    
    # Sort by match score
    recommended.sort(key=lambda x: x["match_score"], reverse=True)
    return [product for product in recommended if "match_score" in product]

# Routes
@router.get("/", response_model=List[BankProduct])
async def get_all_products(
    type: Optional[str] = Query(None, description="Filter by product type"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    search: Optional[str] = Query(None, description="Search in product name and description")
):
    """Get all bank products with optional filtering"""
    filtered_products = products_db
    
    if type:
        filtered_products = [p for p in filtered_products if p["type"] == type]
    
    if risk_level:
        filtered_products = [p for p in filtered_products if p["risk_level"] == risk_level]
    
    if search:
        search_lower = search.lower()
        filtered_products = [
            p for p in filtered_products
            if search_lower in p["name"].lower() or search_lower in p["description"].lower()
        ]
    
    return filtered_products

@router.get("/{product_id}", response_model=BankProduct)
async def get_product(product_id: int):
    """Get specific product by ID"""
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Track product view (for analytics)
    product_views_db.append({
        "product_id": product_id,
        "viewed_at": datetime.now(),
        "user_id": None  # In real app, this would be the authenticated user
    })
    
    return product

@router.post("/recommend", response_model=List[BankProduct])
async def recommend_products_endpoint(request: ProductRecommendationRequest):
    """Get personalized product recommendations"""
    recommendations = recommend_products(
        user_goals=request.user_goals,
        risk_profile=request.risk_profile,
        monthly_income=request.monthly_income
    )
    
    return recommendations

@router.post("/compare")
async def compare_products(request: ProductComparisonRequest):
    """Compare multiple products"""
    compared_products = []
    
    for product_id in request.product_ids:
        product = get_product_by_id(product_id)
        if product:
            compared_products.append(product)
    
    if not compared_products:
        raise HTTPException(status_code=404, detail="No products found for comparison")
    
    return {
        "compared_products": compared_products,
        "comparison_date": datetime.now()
    }

@router.post("/apply")
async def apply_for_product(application: ProductApplication):
    """Submit application for a product"""
    product = get_product_by_id(application.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate application amount
    if product.get("min_amount") and application.amount < product["min_amount"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Minimum amount for this product is {product['min_amount']} ₸"
        )
    
    if product.get("max_amount") and application.amount > product["max_amount"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Maximum amount for this product is {product['max_amount']} ₸"
        )
    
    # Create application record
    application_data = {
        **application.dict(),
        "application_id": len(applications_db) + 1,
        "status": "pending",
        "applied_at": datetime.now(),
        "product_name": product["name"]
    }
    
    applications_db.append(application_data)
    
    return {
        "application_id": application_data["application_id"],
        "status": "pending",
        "message": "Application submitted successfully",
        "estimated_decision_time": "1-3 business days"
    }

@router.get("/types")
async def get_product_types():
    """Get all available product types"""
    types = list(set(product["type"] for product in products_db))
    return {"product_types": types}

@router.get("/categories")
async def get_product_categories():
    """Get product categories and their counts"""
    categories = {}
    for product in products_db:
        if product["type"] not in categories:
            categories[product["type"]] = 0
        categories[product["type"]] += 1
    
    return categories

@router.get("/islamic/principles")
async def get_islamic_principles():
    """Get all Islamic finance principles used in products"""
    principles = set()
    for product in products_db:
        principles.update(product["sharia_principles"])
    
    return {"islamic_principles": list(principles)}

@router.post("/{product_id}/calculate")
async def calculate_product_terms(
    product_id: int,
    amount: int = Query(..., description="Financing or investment amount"),
    timeline_months: int = Query(None, description="Timeline in months")
):
    """Calculate terms for a product (monthly payments, returns, etc.)"""
    product = get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    calculation = {
        "product_id": product_id,
        "product_name": product["name"],
        "amount": amount,
        "timeline_months": timeline_months
    }
    
    if product["type"] == "financing" and timeline_months:
        monthly_payment = calculate_monthly_payment(product, amount, timeline_months)
        calculation["estimated_monthly_payment"] = monthly_payment
        calculation["total_amount"] = monthly_payment * timeline_months
    
    elif product["type"] == "deposit" and timeline_months:
        # Simplified profit calculation for Islamic deposits
        estimated_profit = amount * 0.1 * (timeline_months / 12)  # 10% annual profit share
        calculation["estimated_profit"] = int(estimated_profit)
        calculation["total_return"] = amount + int(estimated_profit)
    
    return calculation

@router.get("/applications/{user_id}")
async def get_user_applications(user_id: int):
    """Get product applications for a specific user"""
    user_applications = [
        app for app in applications_db 
        if app["user_id"] == user_id
    ]
    
    return {
        "user_id": user_id,
        "applications": user_applications,
        "total_applications": len(user_applications)
    }

# Analytics endpoints (for admin purposes)
@router.get("/analytics/popular")
async def get_popular_products(limit: int = Query(5, ge=1, le=20)):
    """Get most viewed products"""
    from collections import Counter
    view_counts = Counter(view["product_id"] for view in product_views_db)
    popular_ids = [product_id for product_id, count in view_counts.most_common(limit)]
    
    popular_products = []
    for product_id in popular_ids:
        product = get_product_by_id(product_id)
        if product:
            popular_products.append({
                **product,
                "view_count": view_counts[product_id]
            })
    
    return popular_products

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "total_products": len(products_db),
        "total_applications": len(applications_db),
        "timestamp": datetime.now()
    }