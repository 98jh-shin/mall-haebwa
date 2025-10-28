"""Product catalogue, cart, review, and recommendation endpoints."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.schemas import (
    CartItem,
    CartProductSummary,
    CartUpdateRequest,
    ProductDetailResponse,
    ProductListResponse,
    RecommendationResponse,
    ReviewCreateRequest,
    ReviewResponse,
    SearchResponseItem,
)

router = APIRouter(tags=["products"])

_reviews: List[ReviewResponse] = [
    ReviewResponse(
        review_id=1,
        product_id="demo-1",
        rating=5,
        content="만족스러운 구매였어요! 품질 최고.",
        created_at=datetime.utcnow(),
    )
]


def _product_to_summary(document: dict) -> dict:
    return {
        "product_id": document["product_id"],
        "title": document["title"],
        "subtitle": document.get("subtitle"),
        "price": document.get("price", 0),
        "sale_price": document.get("sale_price"),
        "stock": document.get("stock", 0),
        "thumbnail_url": document.get("thumbnail_url"),
        "tags": document.get("tags", []),
        "category": document.get("category"),
        "shipping": document.get("shipping"),
        "is_recommended": document.get("is_recommended", False),
        "recommendation_reason": document.get("recommendation_reason"),
    }


def _product_to_detail(document: dict) -> dict:
    base = _product_to_summary(document)
    base.update(
        {
            "sku": document.get("sku"),
            "barcode": document.get("barcode"),
            "status": document.get("status", "published"),
            "gallery": document.get("gallery", []),
            "description": document.get("description", ""),
            "keywords": document.get("keywords", []),
            "created_at": document.get("created_at"),
            "updated_at": document.get("updated_at", document.get("created_at")),
        }
    )
    return base


async def require_user(user_id: Optional[str] = Header(None, alias="X-User-Id")) -> str:
    """Ensure a requester-provided user ID is present."""
    if not user_id or not user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="로그인이 필요합니다.",
        )
    return user_id.strip()


def _cart_product_summary(document: Optional[dict]) -> Optional[CartProductSummary]:
    if not document:
        return None

    summary = _product_to_summary(document)
    return CartProductSummary(
        product_id=summary["product_id"],
        title=summary.get("title"),
        subtitle=summary.get("subtitle"),
        price=summary.get("price"),
        sale_price=summary.get("sale_price"),
        thumbnail_url=summary.get("thumbnail_url"),
        category=summary.get("category"),
        shipping=summary.get("shipping"),
    )


async def _load_cart_items(
    db: AsyncIOMotorDatabase, user_id: str
) -> List[CartItem]:
    document = await db["carts"].find_one({"user_id": user_id})
    raw_items = document.get("items", []) if document else []
    product_ids = {
        item.get("product_id")
        for item in raw_items
        if item.get("product_id")
    }

    product_map = {}
    if product_ids:
        cursor = db["products"].find({"product_id": {"$in": list(product_ids)}})
        documents = await cursor.to_list(length=len(product_ids))
        product_map = {doc["product_id"]: doc for doc in documents}

    items: List[CartItem] = []
    for entry in raw_items:
        product_id = entry.get("product_id")
        if not product_id:
            continue
        try:
            quantity = int(entry.get("quantity", 0))
        except (TypeError, ValueError):
            continue
        if quantity <= 0:
            continue

        items.append(
            CartItem(
                product_id=product_id,
                quantity=quantity,
                product=_cart_product_summary(product_map.get(product_id)),
            )
        )

    return items


@router.get(
    "/products",
    response_model=ProductListResponse,
    summary="상품 목록 조회",
)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=60),
    recommended: Optional[bool] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Return a paginated list of products from the catalogue."""
    query = {}
    if recommended is True:
        query["is_recommended"] = True
    elif recommended is False:
        query["is_recommended"] = {"$ne": True}

    total = await db["products"].count_documents(query)
    skip = (page - 1) * page_size
    cursor = (
        db["products"]
        .find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(page_size)
    )
    documents = await cursor.to_list(length=page_size)
    items = [_product_to_summary(doc) for doc in documents]
    has_more = skip + len(items) < total

    return ProductListResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        has_more=has_more,
    )


@router.get(
    "/product/{product_id}",
    response_model=ProductDetailResponse,
    summary="상품 상세 보기",
)
async def get_product_detail(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Return detailed information for a product stored in MongoDB."""
    document = await db["products"].find_one({"product_id": product_id})
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="상품을 찾을 수 없습니다.")
    return _product_to_detail(document)


@router.get("/cart", response_model=List[CartItem], summary="장바구니 조회")
async def get_cart(
    user_id: str = Depends(require_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Return the persisted cart state for the current user."""
    return await _load_cart_items(db, user_id)


@router.put("/cart", response_model=List[CartItem], summary="장바구니 업데이트")
async def update_cart(
    payload: CartUpdateRequest,
    user_id: str = Depends(require_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Replace the persisted cart items for the current user."""
    filtered = [
        {"product_id": item.product_id, "quantity": item.quantity}
        for item in payload.items
        if item.quantity > 0
    ]
    now = datetime.utcnow()
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {"items": filtered, "updated_at": now},
            "$setOnInsert": {"user_id": user_id, "created_at": now},
        },
        upsert=True,
    )
    return await _load_cart_items(db, user_id)


@router.get(
    "/review/{product_id}",
    response_model=List[ReviewResponse],
    summary="리뷰 조회",
)
async def list_reviews(product_id: str):
    """Return reviews for a given product from the in-memory store."""
    return [review for review in _reviews if review.product_id == product_id]


@router.post(
    "/review/{product_id}",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="리뷰 작성",
)
async def create_review(product_id: str, payload: ReviewCreateRequest):
    """Create a new review in the in-memory store."""
    new_review = ReviewResponse(
        review_id=len(_reviews) + 1,
        product_id=product_id,
        rating=payload.rating,
        content=payload.content,
        created_at=datetime.utcnow(),
    )
    _reviews.append(new_review)
    return new_review


@router.get(
    "/category/{name}",
    response_model=List[SearchResponseItem],
    summary="카테고리별 상품 보기",
)
async def list_by_category(
    name: str,
    limit: int = Query(6, ge=1, le=24),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Return a list of products for a given category."""
    cursor = (
        db["products"]
        .find({"category": name})
        .sort("created_at", -1)
        .limit(limit)
    )
    documents = await cursor.to_list(length=limit)
    return [
        SearchResponseItem(
            product_id=doc["product_id"],
            title=doc["title"],
            price=float(doc.get("sale_price") or doc.get("price", 0)),
            thumbnail_url=doc.get("thumbnail_url"),
        )
        for doc in documents
    ]


@router.get(
    "/recommend",
    response_model=List[RecommendationResponse],
    summary="AI 추천 상품",
)
async def recommend_products(
    limit: int = Query(8, ge=1, le=20),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Return a list of recommended products from the catalogue."""
    cursor = (
        db["products"]
        .find({"is_recommended": True})
        .sort("created_at", -1)
        .limit(limit)
    )
    documents = await cursor.to_list(length=limit)
    return [
        RecommendationResponse(
            product_id=doc["product_id"],
            title=doc["title"],
            reason=doc.get("recommendation_reason"),
        )
        for doc in documents
    ]







