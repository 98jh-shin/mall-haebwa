"""Router package that exposes all API route modules."""

from app.routers import admin, auth, home, orders, product, search

__all__ = [
    "admin",
    "auth",
    "home",
    "orders",
    "product",
    "search",
]

