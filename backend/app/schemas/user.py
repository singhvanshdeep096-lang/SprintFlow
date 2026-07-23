from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    initials: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    timezone: Optional[str] = None
    color: Optional[str] = None
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    class Config:
        from_attributes = True
