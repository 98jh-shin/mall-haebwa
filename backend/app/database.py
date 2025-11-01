# backend/app/database.py
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv
import os

load_dotenv()

_MONGO_URI = os.getenv(
    "MONGODB_URI", "mongodb://3.35.21.238:27017/ecommerce_ai")
DB_NAME = os.getenv("DB_NAME", "ai-shop")
DB_PRODUCT = os.getenv("DB_NAME", "naver_shopping")
_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(_MONGO_URI)
        print("✅ MongoDB 연결 성공")
    return _client


def get_db() -> AsyncIOMotorDatabase:
    client = get_client()
    return client[DB_NAME]


async def get_product_db() -> AsyncIOMotorDatabase:
    client = get_client()
    return client[DB_PRODUCT]
