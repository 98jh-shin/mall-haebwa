"""Pydantic schemas for request and response bodies used by the API."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, constr


class LoginRequest(BaseModel):
    username: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, example="s3cret!")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = Field(None, example="Kim Hana")


class SearchResponseItem(BaseModel):
    product_id: int
    title: str
    price: float
    thumbnail_url: Optional[str] = None


class BuyingRequestItem(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class BuyingRequest(BaseModel):
    items: List[BuyingRequestItem]
    payment_method: Optional[str] = Field(None, example="credit_card")
    shipping_address_id: Optional[int] = None


class MyPageResponse(BaseModel):
    user_id: int
    full_name: Optional[str]
    default_address: Optional[str]
    payment_methods: List[str]


class OrderSummary(BaseModel):
    order_id: int
    status: str
    placed_at: datetime
    total_price: float


class CancelRequest(BaseModel):
    order_id: int
    reason: Optional[str] = None


class ProductDetailResponse(BaseModel):
    product_id: int
    title: str
    description: str
    price: float
    in_stock: bool
    rating: Optional[float] = None


class CartItem(BaseModel):
    product_id: int
    quantity: int


class CartUpdateRequest(BaseModel):
    items: List[CartItem]


class ReviewCreateRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    content: constr(min_length=10, max_length=1000)


class ReviewResponse(BaseModel):
    review_id: int
    product_id: int
    rating: int
    content: str
    created_at: datetime


class RecommendationResponse(BaseModel):
    product_id: int
    title: str
    reason: Optional[str] = None


class SearchLogRequest(BaseModel):
    query: str
    user_id: Optional[int] = None


class AdminActionResponse(BaseModel):
    status: str
    message: str

