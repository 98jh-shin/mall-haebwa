"""MongoDB connection helpers for the FastAPI application."""

from __future__ import annotations

import os
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.seed import ensure_seed_users

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "eco_demo")

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo() -> AsyncIOMotorDatabase:
    """Initialise the MongoDB client and ensure basic indexes exist."""
    global _client, _db

    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URI)
        _db = _client[MONGODB_DB]

        # Verify the connection and create indexes that we rely on.
        await _db.command("ping")
        await _db["users"].create_index("email", unique=True)
        await _db["products"].create_index("product_id", unique=True)
        await _db["orders"].create_index([("user_id", 1), ("created_at", -1)])
        await _db["search_logs"].create_index("created_at")
        await _db["carts"].create_index("user_id", unique=True)

    return _db


async def close_mongo_connection() -> None:
    """Gracefully close the MongoDB client."""
    global _client, _db

    if _client is not None:
        _client.close()
        _client = None
        _db = None


def get_database_or_raise() -> AsyncIOMotorDatabase:
    """
    Return the cached database instance.

    Raises:
        RuntimeError: If ``connect_to_mongo`` has not been called yet.
    """
    if _db is None:
        raise RuntimeError("MongoDB pool is not initialised. Call connect_to_mongo() first.")
    return _db


async def get_db() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency that returns an active Mongo database handle.

    Falls back to creating a new connection when called outside of the
    application startup cycle (e.g., during tests).
    """
    if _db is None:
        db = await connect_to_mongo()
    else:
        db = _db

    await _ensure_admin_seed(db)
    return db


async def _ensure_admin_seed(db: AsyncIOMotorDatabase) -> None:
    """Ensure the default admin account exists after the user collection is cleared."""
    existing_admin = await db["users"].find_one({"role": "admin"})
    if existing_admin is None:
        await ensure_seed_users(db)
