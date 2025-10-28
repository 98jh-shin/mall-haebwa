"""Admin endpoints used for catalog management and inventory."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, Header, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.schemas import AdminActionResponse, ProductCreateRequest
from app.security import TokenDecodeError, decode_access_token

router = APIRouter(prefix="/admin", tags=["admin"])

VALID_PRODUCT_STATUSES = {"published", "draft", "out_of_stock"}


def _extract_token(authorization: Optional[str]) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="���� ��ū�� �ʿ��մϴ�.",
        )
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="�ùٸ� ���� ��ū�� �ʿ��մϴ�.",
        )
    return token.strip()


async def require_admin(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Decode the bearer token and ensure the caller is an admin user."""
    token = _extract_token(authorization)
    try:
        payload = decode_access_token(token)
    except TokenDecodeError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="���� ��ū�� �ߺ��� Ȯ���Ҽ� �����ϴ�.",
        ) from error

    role = str(payload.get("role", "")).lower()
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="������ ������ �ʿ��մϴ�.",
        )
    return payload


@router.get("", summary="������ ��ú���")
async def admin_dashboard():
    """Return high-level metrics for the admin dashboard."""
    return {
        "total_products": 1520,
        "low_stock": 37,
        "pending_orders": 12,
    }


@router.post(
    "/products",
    response_model=AdminActionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="��ǰ ����",
)
async def create_product(
    payload: ProductCreateRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    _: Dict[str, Any] = Depends(require_admin),
):
    """Persist a new product in the catalogue."""
    if payload.sale_price and payload.sale_price >= payload.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="���� �ǸŰ��� ���� �ǸŰ����� ���ƾ� �մϴ�.",
        )
    if payload.status not in VALID_PRODUCT_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="�������� �ʴ� ��ǰ �����Դϴ�.",
        )

    now = datetime.utcnow()
    product = payload.dict()
    product_id = str(uuid4())

    product.update(
        {
            "product_id": product_id,
            "sku": product.get("sku") or None,
            "barcode": product.get("barcode") or None,
            "sale_price": product.get("sale_price") or None,
            "recommendation_reason": product.get("recommendation_reason") or None,
            "tags": [tag for tag in product.get("tags", []) if tag],
            "keywords": [keyword for keyword in product.get("keywords", []) if keyword],
            "gallery": [str(url) for url in product.get("gallery", []) if url],
            "thumbnail_url": str(product["thumbnail_url"]),
            "created_at": now,
            "updated_at": now,
        }
    )

    await db["products"].insert_one(product)

    return AdminActionResponse(
        status="success",
        message="��ǰ�� ��ϵǾ����ϴ�.",
        data={"product_id": product_id},
    )
