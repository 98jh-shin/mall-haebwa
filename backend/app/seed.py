"""Seed helpers for populating demo data in the database."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List
from uuid import uuid4

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.security import hash_password

SAMPLE_PRODUCTS: List[Dict[str, Any]] = [
    {
        "title": "프리미엄 모달 침구 세트",
        "subtitle": "사계절 내내 포근한 60수 모달 코튼 혼방 원단",
        "price": 159000,
        "sale_price": 119000,
        "stock": 120,
        "category": "living",
        "shipping": "무료 배송",
        "status": "published",
        "thumbnail_url": "https://images.unsplash.com/photo-1616628174490-1bbefc585acb?auto=format&fit=crop&w=960&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1616627459344-3b0b74292b73?auto=format&fit=crop&w=960&q=80",
            "https://images.unsplash.com/photo-1616627574497-2ceebd16687f?auto=format&fit=crop&w=960&q=80",
        ],
        "description": "부드러운 터치감의 모달과 통기성이 뛰어난 코튼이 만나 사계절 내내 기분 좋은 수면을 선사합니다.",
        "keywords": ["침구", "모달", "베딩"],
        "tags": ["프리미엄", "특가", "인기"],
        "is_recommended": True,
        "recommendation_reason": "여름밤에도 쾌적한 스마트 온도 조절 기능을 갖춘 베스트셀러 침구예요.",
    },
    {
        "title": "에어로핏 스마트 공기청정기",
        "subtitle": "30평형 공간을 10분 만에 정화하는 듀얼 헤파 필터 시스템",
        "price": 329000,
        "sale_price": 279000,
        "stock": 45,
        "category": "electronics",
        "shipping": "오늘출발",
        "status": "published",
        "thumbnail_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=960&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1598969234603-4b2f1bbfd5d1?auto=format&fit=crop&w=960&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=960&q=80",
        ],
        "description": "초미세먼지까지 99.97% 제거하는 H13 헤파 필터와 IoT 연동으로 외출 중에도 실내 공기를 관리하세요.",
        "keywords": ["공기청정기", "스마트홈", "IoT"],
        "tags": ["NEW", "오늘출발"],
        "is_recommended": True,
        "recommendation_reason": "갓 출시된 신제품으로, 스마트홈과 연동해 손쉽게 관리할 수 있어요.",
    },
    {
        "title": "시그니처 콜드브루 세트 6입",
        "subtitle": "프리미엄 원두를 저온 추출한 깊고 진한 홈카페 라인업",
        "price": 24900,
        "sale_price": 19900,
        "stock": 240,
        "category": "food",
        "shipping": "무료 배송",
        "status": "published",
        "thumbnail_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=960&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?auto=format&fit=crop&w=960&q=80",
            "https://images.unsplash.com/photo-1549652520-69faf2b4762b?auto=format&fit=crop&w=960&q=80",
        ],
        "description": "에티오피아 예가체프와 콜롬비아 수프리모를 블렌딩해 깊은 풍미를 살렸습니다. 냉장 보관으로 최대 2주까지 신선하게 즐기세요.",
        "keywords": ["콜드브루", "커피", "홈카페"],
        "tags": ["베스트셀러", "단독"],
        "is_recommended": True,
        "recommendation_reason": "출시 이후 재구매율 87%를 기록한 SwiftCart 인기 상품이에요.",
    },
    {
        "title": "젠핏 홈트 세라밴드 5종 세트",
        "subtitle": "입문자부터 고강도 운동까지 커버하는 5단계 탄성 밴드",
        "price": 34900,
        "sale_price": None,
        "stock": 98,
        "category": "sports",
        "shipping": "3,000원",
        "status": "published",
        "thumbnail_url": "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=960&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1593476123561-9516f2097156?auto=format&fit=crop&w=960&q=80",
            "https://images.unsplash.com/photo-1571019613914-85f342c1d4b1?auto=format&fit=crop&w=960&q=80",
        ],
        "description": "프리미엄 라텍스 소재로 제작되어 내구성이 뛰어나며, 단계별 컬러로 운동 강도를 쉽게 조절할 수 있습니다.",
        "keywords": ["홈트", "운동", "밴드"],
        "tags": ["인기", "운동"],
        "is_recommended": False,
        "recommendation_reason": None,
    },
]


DEFAULT_USERS: List[Dict[str, Any]] = [
    {
        "email": "demo@eco.com",
        "password": "password",
        "full_name": "Eco Demo",
        "role": "user",
    },
    {
        "email": "admin@eco.com",
        "password": "admin1234",
        "full_name": "Eco Admin",
        "role": "admin",
    },
]


async def ensure_seed_products(db: AsyncIOMotorDatabase) -> None:
    """Populate demo products if the catalogue is empty."""
    collection = db["products"]
    count = await collection.count_documents({})
    if count:
        return

    now = datetime.utcnow()
    payload = []
    for item in SAMPLE_PRODUCTS:
        document = {
            **item,
            "product_id": item.get("product_id", str(uuid4())),
            "created_at": now,
            "updated_at": now,
        }
        payload.append(document)

    if payload:
        await collection.insert_many(payload)


async def ensure_seed_users(db: AsyncIOMotorDatabase) -> None:
    """Create default demo accounts used by the frontend."""
    collection = db["users"]

    for user in DEFAULT_USERS:
        existing = await collection.find_one({"email": user["email"]})
        if existing:
            continue

        now = datetime.utcnow()
        document = {
            "user_id": user.get("user_id", str(uuid4())),
            "email": user["email"],
            "password_hash": hash_password(user["password"]),
            "full_name": user.get("full_name"),
            "role": user.get("role", "user"),
            "created_at": now,
            "updated_at": now,
        }
        await collection.insert_one(document)
