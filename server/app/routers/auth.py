"""Authentication related endpoints."""

from fastapi import APIRouter, HTTPException, status

from app.schemas import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(tags=["auth"])


@router.post("/login", response_model=TokenResponse, summary="사용자 로그인")
async def login(payload: LoginRequest):
    """
    Fake login handler that validates credentials and returns an access token.

    Replace this logic with a real authentication flow (database lookup,
    password verification, etc.).
    """
    if payload.username != "demo@eco.com" or payload.password != "password":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )
    return TokenResponse(access_token="demo-token")


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="사용자 회원가입",
)
async def register(payload: RegisterRequest):
    """Stub that simulates user creation."""
    return {
        "message": "User registered successfully.",
        "email": payload.email,
        "full_name": payload.full_name,
    }

