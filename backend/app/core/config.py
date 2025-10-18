import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Zaman AI Financial Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # AI API Configuration from provided instructions
    AI_API_KEY: str = "sk-roG30usRr0TLCHAADks6lw"
    AI_BASE_URL: str = "https://openai-hub.neuraldeep.tech"
    
    # Database
    DATABASE_URL: str = "sqlite:///./zaman_assistant.db"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Islamic Finance Settings
    ISLAMIC_PRODUCTS = {
        "mudaraba": {
            "name": "Мудараба Сберегательный",
            "type": "deposit",
            "min_amount": 50000,
            "max_amount": 10000000,
            "risk_level": "low",
            "sharia_compliant": True,
            "description": "Участие в прибыли банка без фиксированного процента"
        },
        "murabaha_housing": {
            "name": "Мурабаха Жилье", 
            "type": "credit",
            "min_amount": 1000000,
            "max_amount": 50000000,
            "risk_level": "medium",
            "sharia_compliant": True,
            "description": "Финансирование покупки недвижимости с наценкой"
        },
        "musharaka_business": {
            "name": "Мушарака Бизнес",
            "type": "investment", 
            "min_amount": 500000,
            "max_amount": 50000000,
            "risk_level": "high",
            "sharia_compliant": True,
            "description": "Совместное предпринимательство с разделением прибыли"
        }
    }

settings = Settings()