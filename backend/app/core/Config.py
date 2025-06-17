from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    """Configuration class for the application."""
    async_db: bool = True  # Use async database by default

    # General settings
    APP_NAME: str = os.getenv("APP_NAME", "Open CBT")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1")

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ucbethuel")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

    def get_database_url(cls, async_db: bool = False):
        """
        Returns the database URL.
        If async_db is specified, it overrides the class setting.
        """
        use_async = cls.async_db if async_db else async_db
        if use_async:
            return os.getenv("SQLITE_ASYNC", "sqlite+aiosqlite:///./test.db")
        else:
            return os.getenv("SQLITE_SYNC", "sqlite:///./test.db")