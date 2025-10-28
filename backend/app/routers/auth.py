"""Authentication related endpoints."""

from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError

from app.database import get_db
from app.schemas import (
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
)
from app.security import generate_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def _normalise_email(value: str) -> str:
    return value.strip().lower()


@router.post("/login", response_model=TokenResponse, summary="사용자 로그인")
async def login(
    payload: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)
) -> TokenResponse:
    """Authenticate against stored credentials."""
    email = _normalise_email(payload.username)
    user = await db["users"].find_one({"email": email})

    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 올바르지 않습니다.",
        )

    user_id = user.get("user_id", str(user["_id"]))
    role = str(user.get("role", "user")).lower()
    access_token = generate_access_token(
        user_id=user_id,
        email=email,
        role=role,
    )
    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "last_login_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return TokenResponse(
        access_token=access_token,
        user_id=user_id,
        email=email,
        role=role,
    )


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="사용자 회원가입",
)
async def register(
    payload: RegisterRequest, db: AsyncIOMotorDatabase = Depends(get_db)
) -> RegisterResponse:
    """Create a new user account with a hashed password."""
    email = _normalise_email(payload.email)
    existing = await db["users"].find_one({"email": email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 사용 중인 이메일입니다.",
        )

    password_hash = hash_password(payload.password)
    document = {
        "user_id": str(uuid4()),
        "email": email,
        "password_hash": password_hash,
        "full_name": payload.full_name,
        "role": "user",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    try:
        await db["users"].insert_one(document)
    except DuplicateKeyError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 사용 중인 이메일입니다.",
        ) from error

    return RegisterResponse(
        message="회원가입이 완료되었습니다.",
        email=email,
        user_id=document["user_id"],
        full_name=document["full_name"],
        role=document["role"],
    )
