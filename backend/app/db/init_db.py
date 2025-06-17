from app.db.utils import create_all_tables, async_create_all_tables, get_engine_and_session
from app.db.model import Base

async_mode = True  # Set to True if you want to use async mode

engine, SessionLocal = get_engine_and_session(async_mode=async_mode)

if __name__ == "__main__":
    if async_mode:
        async def main():
            await async_create_all_tables(engine)
        import asyncio
        asyncio.run(main())
    else:
        create_all_tables(engine)