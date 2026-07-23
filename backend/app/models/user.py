from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    initials = Column(String, nullable=True)
    role = Column(String, nullable=True)
    department = Column(String, nullable=True)
    location = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    color = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
