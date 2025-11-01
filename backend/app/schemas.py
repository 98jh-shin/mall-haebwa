# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, Field


class UserIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str | None = None
    address: str | None = None
    role: str = "user"


class LoginIn(BaseModel):
    email: EmailStr
    password: str
    remember: bool = False


class UserOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    name: str
    phone: str | None = None
    address: str | None = None
    role: str = "user"


class BasicResp(BaseModel):
    message: str
