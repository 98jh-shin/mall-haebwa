"""Pydantic schemas for request and response bodies used by the API."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, HttpUrl, constr


class LoginRequest(BaseModel):
    username: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, example="s3cret!")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str


class RegisterRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = Field(None, example="Kim Hana")


class RegisterResponse(BaseModel):
    message: str
    email: str
    user_id: str
    full_name: Optional[str] = None
    role: str


class SearchResponseItem(BaseModel):
    product_id: str
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


class ProductCreateRequest(BaseModel):
    title: constr(min_length=1, max_length=120)
    subtitle: Optional[constr(strip_whitespace=True, max_length=160)] = None
    sku: Optional[constr(strip_whitespace=True, max_length=60)] = None
    barcode: Optional[constr(strip_whitespace=True, max_length=80)] = None
    price: int = Field(..., ge=1)
    sale_price: Optional[int] = Field(None, ge=1)
    stock: int = Field(..., ge=0)
    category: Optional[constr(strip_whitespace=True, max_length=60)] = None
    shipping: Optional[constr(strip_whitespace=True, max_length=60)] = None
    status: constr(strip_whitespace=True, max_length=40) = "published"
    thumbnail_url: HttpUrl
    gallery: List[HttpUrl] = Field(default_factory=list)
    description: constr(min_length=10)
    keywords: List[constr(strip_whitespace=True, max_length=40)] = Field(default_factory=list)
    tags: List[constr(strip_whitespace=True, max_length=30)] = Field(default_factory=list)
    is_recommended: bool = False
    recommendation_reason: Optional[constr(strip_whitespace=True, max_length=200)] = None


class ProductSummary(BaseModel):
    product_id: str
    title: str
    subtitle: Optional[str] = None
    price: int
    sale_price: Optional[int] = None
    stock: int
    thumbnail_url: HttpUrl
    tags: List[str] = Field(default_factory=list)
    category: Optional[str] = None
    shipping: Optional[str] = None
    is_recommended: bool = False
    recommendation_reason: Optional[str] = None


class ProductDetailResponse(ProductSummary):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    status: str
    gallery: List[HttpUrl] = Field(default_factory=list)
    description: str
    keywords: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    items: List[ProductSummary]
    page: int
    page_size: int
    total: int
    has_more: bool


class CartProductSummary(BaseModel):
    product_id: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    price: Optional[int] = None
    sale_price: Optional[int] = None
    thumbnail_url: Optional[HttpUrl] = None
    category: Optional[str] = None
    shipping: Optional[str] = None


class CartItem(BaseModel):
    product_id: str
    quantity: int = Field(..., ge=1)
    product: Optional[CartProductSummary] = None


class CartUpdateRequest(BaseModel):
    items: List[CartItem]


class ReviewCreateRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    content: constr(min_length=10, max_length=1000)


class ReviewResponse(BaseModel):
    review_id: int
    product_id: str
    rating: int
    content: str
    created_at: datetime


class RecommendationResponse(BaseModel):
    product_id: str
    title: str
    reason: Optional[str] = None


class SearchLogRequest(BaseModel):
    query: str
    user_id: Optional[int] = None


class AdminActionResponse(BaseModel):
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None

