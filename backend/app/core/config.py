import os
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Project Information
    PROJECT_NAME: str = "Zaman AI Islamic Financial Assistant"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Персональный помощник для управления финансами в соответствии с принципами ислама"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, staging, production
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://zaman-bank.vercel.app",
        "https://*.vercel.app",
    ]
    
    # Add your production frontend URL here
    if os.getenv("FRONTEND_URL"):
        CORS_ORIGINS.append(os.getenv("FRONTEND_URL"))

    # AI API Configuration - Zaman Bank Provided
    AI_API_KEY: str = os.getenv("AI_API_KEY", "sk-roG30usRr0TLCHAADks6lw")
    AI_BASE_URL: str = os.getenv("AI_BASE_URL", "https://openai-hub.neuraldeep.tech")
    
    # AI Models Configuration
    AI_MODELS = {
        "chat": "gpt-4o-mini",
        "transcription": "whisper-1",
        "embedding": "text-embedding-ada-002"
    }
    
    # AI Service Settings
    AI_TIMEOUT: int = int(os.getenv("AI_TIMEOUT", "30"))
    AI_MAX_TOKENS: int = int(os.getenv("AI_MAX_TOKENS", "1000"))
    AI_TEMPERATURE: float = float(os.getenv("AI_TEMPERATURE", "0.7"))
    
    # Database Configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./zaman_ai.db"  # Default to SQLite for development
    )
    
    # Supabase Configuration (if using Supabase)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # Security & Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Password Security
    BCRYPT_ROUNDS: int = int(os.getenv("BCRYPT_ROUNDS", "12"))
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    # Islamic Finance Configuration
    ISLAMIC_FINANCE = {
        "zakat_percentage": 0.025,  # 2.5%
        "recommended_savings_rate": 0.2,  # 20%
        "recommended_investment_rate": 0.15,  # 15%
        "essential_spending_limit": 0.5,  # 50%
        "development_spending_rate": 0.125,  # 12.5%
    }
    
    # Bank Products Configuration
    BANK_PRODUCTS = {
        "min_deposit_amount": 50000,
        "min_financing_amount": 1000000,
        "min_investment_amount": 100000,
        "max_financing_term_years": 20,
        "max_auto_lease_term_years": 7,
    }
    
    # Analytics Configuration
    ANALYTICS = {
        "default_time_range": "month",
        "supported_ranges": ["week", "month", "year"],
        "expense_categories": ["housing", "food", "transport", "health", "entertainment", "other"],
        "goal_categories": ["housing", "transport", "education", "health", "hajj", "business", "other"]
    }
    
    # Cache Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Monitoring & Analytics
    ENABLE_METRICS: bool = os.getenv("ENABLE_METRICS", "False").lower() == "true"
    METRICS_PORT: int = int(os.getenv("METRICS_PORT", "9090"))
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["audio/wav", "audio/webm", "audio/mpeg"]
    
    # Email Configuration (for notifications)
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@zaman-bank.kz")
    
    # External APIs
    EXCHANGE_RATE_API: str = os.getenv("EXCHANGE_RATE_API", "")
    EXCHANGE_RATE_API_KEY: str = os.getenv("EXCHANGE_RATE_API_KEY", "")
    
    # Feature Flags
    FEATURE_FLAGS = {
        "voice_assistant": os.getenv("FEATURE_VOICE_ASSISTANT", "True").lower() == "true",
        "islamic_products": os.getenv("FEATURE_ISLAMIC_PRODUCTS", "True").lower() == "true",
        "financial_planning": os.getenv("FEATURE_FINANCIAL_PLANNING", "True").lower() == "true",
        "goal_tracking": os.getenv("FEATURE_GOAL_TRACKING", "True").lower() == "true",
        "spending_analytics": os.getenv("FEATURE_SPENDING_ANALYTICS", "True").lower() == "true",
    }

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def is_staging(self) -> bool:
        return self.ENVIRONMENT == "staging"
    
    @property
    def database_type(self) -> str:
        if "postgresql" in self.DATABASE_URL:
            return "postgresql"
        elif "sqlite" in self.DATABASE_URL:
            return "sqlite"
        else:
            return "unknown"

    def get_database_config(self) -> dict:
        """Get database configuration for different environments"""
        if self.database_type == "postgresql":
            return {
                "url": self.DATABASE_URL,
                "pool_size": 5,
                "max_overflow": 10,
                "echo": self.DEBUG
            }
        else:  # SQLite
            return {
                "url": self.DATABASE_URL,
                "connect_args": {"check_same_thread": False} if self.database_type == "sqlite" else {},
                "echo": self.DEBUG
            }

    def get_ai_config(self) -> dict:
        """Get AI service configuration"""
        return {
            "base_url": self.AI_BASE_URL,
            "api_key": self.AI_API_KEY,
            "timeout": self.AI_TIMEOUT,
            "models": self.AI_MODELS,
            "max_tokens": self.AI_MAX_TOKENS,
            "temperature": self.AI_TEMPERATURE
        }

    def get_security_config(self) -> dict:
        """Get security configuration"""
        return {
            "secret_key": self.SECRET_KEY,
            "algorithm": self.ALGORITHM,
            "access_token_expire_minutes": self.ACCESS_TOKEN_EXPIRE_MINUTES,
            "bcrypt_rounds": self.BCRYPT_ROUNDS
        }

# Global settings instance
settings = Settings()

# Environment-specific configurations
if settings.is_development:
    # Development-specific settings
    settings.DEBUG = True
    settings.LOG_LEVEL = "DEBUG"
    
elif settings.is_production:
    # Production-specific settings
    settings.DEBUG = False
    settings.LOG_LEVEL = "INFO"
    # Ensure secret key is set in production
    if settings.SECRET_KEY == "your-super-secret-jwt-key-change-in-production":
        raise ValueError("SECRET_KEY must be set in production environment")

elif settings.is_staging:
    # Staging-specific settings
    settings.DEBUG = True
    settings.LOG_LEVEL = "INFO"