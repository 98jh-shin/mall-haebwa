"""Admin endpoints used for catalog management and inventory."""

from fastapi import APIRouter, status

from app.schemas import AdminActionResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("", summary="관리자 대시보드")
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
    summary="상품 생성",
)
async def create_product():
    """Placeholder endpoint for product creation."""
    return AdminActionResponse(
        status="success",
        message="Product created (demo mode).",
    )


@router.patch(
    "/products/{product_id}",
    response_model=AdminActionResponse,
    summary="상품 수정",
)
async def update_product(product_id: int):
    """Placeholder endpoint for product update."""
    return AdminActionResponse(
        status="success",
        message=f"Product {product_id} updated (demo mode).",
    )

