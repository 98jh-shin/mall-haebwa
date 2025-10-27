"""Search-related endpoints, including hybrid search and logging."""

from datetime import datetime
from typing import List

from fastapi import APIRouter, Query

from app.schemas import SearchLogRequest, SearchResponseItem

router = APIRouter(tags=["search"])

_search_logs: List[dict] = []


@router.get(
    "/search",
    response_model=List[SearchResponseItem],
    summary="상품 검색",
)
async def search_products(
    q: str = Query(..., description="검색어 (키워드 또는 자연어 문장)"),
    limit: int = Query(10, ge=1, le=50),
):
    """
    Hybrid search placeholder.

    In production, connect this to a vector/keyword search engine.
    """
    return [
        SearchResponseItem(
            product_id=100 + idx,
            title=f"{q} 추천 상품 {idx + 1}",
            price=99000 + idx * 1000,
            thumbnail_url=f"https://cdn.example.com/products/{100 + idx}.jpg",
        )
        for idx in range(limit)
    ]


@router.get("/search/logs", summary="검색 로그 조회")
async def get_search_logs():
    """Return stored search logs."""
    return _search_logs


@router.post("/search/logs", status_code=201, summary="검색 로그 기록")
async def create_search_log(payload: SearchLogRequest):
    """Store a search log entry. In-memory store for demo purposes."""
    entry = {
        "query": payload.query,
        "user_id": payload.user_id,
        "timestamp": datetime.utcnow().isoformat(),
    }
    _search_logs.append(entry)
    return entry

