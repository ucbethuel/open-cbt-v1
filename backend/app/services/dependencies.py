from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.utils import get_engine_and_session
from app.db.model import User

# Async DB session dependency
async def get_async_db():
    engine, SessionLocal = get_engine_and_session(async_mode=True)
    async with SessionLocal() as session:
        yield session

# Async current user dependency (replace user_id logic with real auth)
async def get_current_user_async(
    db: AsyncSession = Depends(get_async_db), user_id: int = 1
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user