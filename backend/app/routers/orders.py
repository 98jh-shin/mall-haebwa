"""Order and account management endpoints."""

from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter

from app.schemas import (
    BuyingRequest,
    CancelRequest,
    MyPageResponse,
    OrderSummary,
)

router = APIRouter(tags=["orders"])


@router.post("/buying", summary="상품 구매 요청")
async def create_order(payload: BuyingRequest):
    """Pretend to create an order with the supplied items."""
    total_price = sum(item.quantity * 10000 for item in payload.items)
    return {
        "order_id": 5001,
        "status": "pending",
        "total_price": total_price,
        "payment_method": payload.payment_method,
    }


@router.get("/my_page", response_model=MyPageResponse, summary="마이페이지 데이터")
async def get_my_page():
    """Return placeholder data for the authenticated user's my page."""
    return MyPageResponse(
        user_id=1,
        full_name="Demo User",
        default_address="서울시 강남구 테헤란로 123",
        payment_methods=["credit_card", "naver_pay"],
    )


@router.get(
    "/order_list",
    response_model=List[OrderSummary],
    summary="주문/배송 목록 조회",
)
async def list_orders():
    """Return a mock list of order summaries."""
    now = datetime.utcnow()
    return [
        OrderSummary(
            order_id=4001,
            status="delivered",
            placed_at=now - timedelta(days=5),
            total_price=159000,
        ),
        OrderSummary(
            order_id=4002,
            status="shipping",
            placed_at=now - timedelta(days=2),
            total_price=329000,
        ),
    ]


@router.post("/cancel", summary="주문 취소 요청")
async def cancel_order(payload: CancelRequest):
    """Handle a mock order cancellation request."""
    return {
        "order_id": payload.order_id,
        "status": "cancel_requested",
        "reason": payload.reason,
    }

