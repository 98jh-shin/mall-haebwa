"""Main FastAPI application instance."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import close_mongo_connection, connect_to_mongo
from app.routers import admin, auth, home, orders, product, search
from app.seed import ensure_seed_products, ensure_seed_users

app = FastAPI(
    title="Eco Demo E-Commerce API",
    description="FastAPI 기반 전자상거래 서버의 기본 구조입니다.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialise the Mongo connection and seed the catalogue."""
    db = await connect_to_mongo()
    await ensure_seed_products(db)
    await ensure_seed_users(db)


@app.on_event("shutdown")
async def shutdown_event():
    """Close the Mongo connection pool when the app stops."""
    await close_mongo_connection()


app.include_router(home.router)
app.include_router(auth.router)
app.include_router(search.router)
app.include_router(orders.router)
app.include_router(product.router)
app.include_router(admin.router)


@app.get("/health", tags=["health"], summary="헬스 체크")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok"}

