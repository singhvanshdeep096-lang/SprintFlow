from pydantic import BaseModel, EmailStr
from typing import Optional, List

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Developer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
