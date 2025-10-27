"""Product catalogue, cart, review, and recommendation endpoints."""

from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.schemas import (
    CartItem,
    CartUpdateRequest,
    ProductDetailResponse,
    RecommendationResponse,
    ReviewCreateRequest,
    ReviewResponse,
    SearchResponseItem,
)

router = APIRouter(tags=["products"])

_cart_state: List[CartItem] = [
    CartItem(product_id=1, quantity=2),
    CartItem(product_id=3, quantity=1),
]

_reviews: List[ReviewResponse] = [
    ReviewResponse(
        review_id=1,
        product_id=1,
        rating=5,
        content="만족스러운 구매였어요! 품질 최고.",
        created_at=datetime.utcnow(),
    )
]


@router.get(
    "/product/{product_id}",
    response_model=ProductDetailResponse,
    summary="상품 상세 보기",
)
async def get_product_detail(product_id: int):
    """Return mock product detail data."""
    if product_id < 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return ProductDetailResponse(
        product_id=product_id,
        title=f"데모 상품 {product_id}",
        description="이곳에 상품 상세 설명이 들어갑니다.",
        price=199000,
        in_stock=True,
        rating=4.7,
    )


@router.get("/cart", response_model=List[CartItem], summary="장바구니 조회")
async def get_cart():
    """Return the in-memory cart state."""
    return _cart_state


@router.put("/cart", response_model=List[CartItem], summary="장바구니 업데이트")
async def update_cart(payload: CartUpdateRequest):
    """Replace the in-memory cart with the provided items."""
    _cart_state.clear()
    _cart_state.extend(payload.items)
    return _cart_state


@router.get(
    "/review/{product_id}",
    response_model=List[ReviewResponse],
    summary="리뷰 조회",
)
async def list_reviews(product_id: int):
    """Return reviews for a given product from the in-memory store."""
    return [review for review in _reviews if review.product_id == product_id]


@router.post(
    "/review/{product_id}",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="리뷰 작성",
)
async def create_review(product_id: int, payload: ReviewCreateRequest):
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
async def list_by_category(name: str):
    """Return a list of products for a given category."""
    return [
        SearchResponseItem(
            product_id=200 + idx,
            title=f"{name} 인기 상품 {idx + 1}",
            price=49000 + idx * 5000,
            thumbnail_url=f"https://cdn.example.com/{name}/{200 + idx}.jpg",
        )
        for idx in range(3)
    ]


@router.get(
    "/recommend",
    response_model=List[RecommendationResponse],
    summary="AI 추천 상품",
)
async def recommend_products():
    """Return a placeholder list of AI-driven product recommendations."""
    return [
        RecommendationResponse(
            product_id=900 + idx,
            title=f"추천 상품 {idx + 1}",
            reason="최근 본 상품과 유사한 아이템",
        )
        for idx in range(4)
    ]

