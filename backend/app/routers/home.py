"""Routes related to the public landing experience."""

from fastapi import APIRouter

router = APIRouter(tags=["home"])


@router.get("/", summary="홈 메인 페이지 데이터")
async def read_home():
    """Return placeholder data for the e-commerce landing page."""
    return {
        "banner": {
            "title": "테크 페스티벌 세일",
            "subtitle": "최대 50% 할인 + 무료배송",
        },
        "recommended_products": [
            {"product_id": 1, "title": "무선 이어폰", "price": 129000},
            {"product_id": 2, "title": "프리미엄 노트북", "price": 1890000},
        ],
        "categories": ["디지털", "패션", "리빙", "푸드"],
    }

