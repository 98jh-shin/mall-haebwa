"""Utility helpers for hashing passwords and issuing tokens."""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt
from jwt import InvalidTokenError


_PBKDF2_ALGORITHM = "sha256"
_PBKDF2_ITERATIONS = 310_000
_PBKDF2_SALT_BYTES = 16
_JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me")
_JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
try:
    _JWT_ACCESS_TOKEN_EXPIRES_MINUTES = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "120")
    )
except ValueError:
    _JWT_ACCESS_TOKEN_EXPIRES_MINUTES = 120


class TokenDecodeError(Exception):
    """Raised when an access token cannot be decoded."""


def hash_password(password: str) -> str:
    """Return a salted PBKDF2 hash for the provided password."""
    if not isinstance(password, str) or password == "":
        raise ValueError("password must be a non-empty string")

    salt = secrets.token_bytes(_PBKDF2_SALT_BYTES)
    digest = hashlib.pbkdf2_hmac(
        _PBKDF2_ALGORITHM, password.encode("utf-8"), salt, _PBKDF2_ITERATIONS
    )
    return f"{_b64encode(salt)}${_b64encode(digest)}"


def verify_password(password: str, encoded_hash: str) -> bool:
    """Validate a password against a previously generated hash."""
    if not password or not encoded_hash:
        return False

    try:
        salt_b64, hash_b64 = encoded_hash.split("$", 1)
    except ValueError:
        return False

    salt = _b64decode(salt_b64)
    expected = _b64decode(hash_b64)
    derived = hashlib.pbkdf2_hmac(
        _PBKDF2_ALGORITHM, password.encode("utf-8"), salt, _PBKDF2_ITERATIONS
    )
    return hmac.compare_digest(derived, expected)


def generate_access_token(
    *, user_id: str, email: str, role: str, expires_delta: Optional[timedelta] = None
) -> str:
    """Create a signed JWT that includes user metadata for authorization checks."""
    if not user_id:
        raise ValueError("user_id is required to generate an access token")

    if expires_delta is None:
        expires_delta = timedelta(minutes=_JWT_ACCESS_TOKEN_EXPIRES_MINUTES)

    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + expires_delta
    payload = {
        "sub": str(user_id),
        "email": str(email).lower(),
        "role": str(role).lower(),
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    return jwt.encode(payload, _JWT_SECRET_KEY, algorithm=_JWT_ALGORITHM)


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode a JWT access token and return its payload."""
    if not token:
        raise TokenDecodeError("access token is missing")

    try:
        payload = jwt.decode(token, _JWT_SECRET_KEY, algorithms=[_JWT_ALGORITHM])
    except InvalidTokenError as exc:
        raise TokenDecodeError("access token is invalid") from exc

    if "role" in payload and isinstance(payload["role"], str):
        payload["role"] = payload["role"].lower()
    if "email" in payload and isinstance(payload["email"], str):
        payload["email"] = payload["email"].lower()
    return payload


def _b64encode(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def _b64decode(data: str) -> bytes:
    return base64.b64decode(data.encode("ascii"))
