# backend/app/models.py
from motor.motor_asyncio import AsyncIOMotorDatabase

USERS_COL = "users"


async def ensure_indexes(db: AsyncIOMotorDatabase):
    await db[USERS_COL].create_index("email", unique=True)
