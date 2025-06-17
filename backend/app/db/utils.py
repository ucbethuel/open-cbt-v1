from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker
# Use declarative_base from sqlalchemy.orm for SQLAlchemy 2.0+
from app.core.Config import Config
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker
from app.db.model import Base

async def async_create_all_tables(async_engine):
    """
    Asynchronously create all tables using an async SQLAlchemy engine.
    Usage:
        await async_create_all_tables(async_engine)
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def create_all_tables(engine):
    """
    Create all tables for both sync and async SQLAlchemy engines.
    Usage:
        create_all_tables(engine)
    """
    if isinstance(engine, Engine):
        # Synchronous engine
        Base.metadata.create_all(bind=engine)
    elif isinstance(engine, AsyncEngine):
        import asyncio
        async def async_create():
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        asyncio.run(async_create())
    else:
        raise ValueError("Unsupported engine type")

def get_engine_and_session(async_mode: bool = False):
    """
    Creates and returns a SQLAlchemy engine and session factory, supporting both synchronous and asynchronous modes.

    Args:
        async_mode (bool, optional): If True, creates an asynchronous engine and sessionmaker using SQLAlchemy's async API.
                                     If False (default), creates a synchronous engine and sessionmaker.

    Returns:
        tuple: A tuple containing:
            - engine: The SQLAlchemy engine instance (either synchronous or asynchronous).
            - SessionLocal: The sessionmaker or async_sessionmaker instance, configured for the chosen mode.

    Notes:
        - The database URL is obtained from the Config.get_database_url method, which should be compatible with the selected mode.
        - For async_mode=True, ensure the database URL uses an async driver (e.g., "postgresql+asyncpg://").
        - The returned SessionLocal should be used to create session instances for database operations.
    """

    database_url = Config.get_database_url(async_db=async_mode)
    if async_mode:
        # Ensure your database URL is async-compatible, e.g., "postgresql+asyncpg://..."
        engine = create_async_engine(database_url, echo=True, future=True)
        SessionLocal = async_sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=engine,
            expire_on_commit=False,
        )
    else:
        engine = create_engine(database_url, echo=True, future=True)
        SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=engine,
        )
    return engine, SessionLocal

