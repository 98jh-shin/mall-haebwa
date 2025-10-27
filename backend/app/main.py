from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# 추후 MongoDB 연결 추가
# from app.database import connect_to_mongo, close_mongo_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작/종료 시 실행되는 이벤트"""
    # 시작 시
    print("🚀 Application startup...")
    # await connect_to_mongo()
    
    yield
    
    # 종료 시
    print("🛑 Application shutdown...")
    # await close_mongo_connection()


# FastAPI 앱 생성
app = FastAPI(
    title="E-Commerce AI Platform API",
    description="의도 기반 E-Commerce 플랫폼 백엔드 API",
    version="0.1.0",
    lifespan=lifespan
)

# CORS 설정
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 헬스 체크 엔드포인트
@app.get("/")
async def root():
    return {
        "message": "E-Commerce AI Platform API",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected"  # 추후 실제 DB 상태 체크
    }


# 추후 라우터 추가
# from app.api import products, search, orders
# app.include_router(products.router, prefix="/api/products", tags=["products"])
# app.include_router(search.router, prefix="/api/search", tags=["search"])
# app.include_router(orders.router, prefix="/api/orders", tags=["orders"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("BACKEND_PORT", 8000)),
        reload=True
    )
