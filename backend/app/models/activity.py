from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    target = Column(String, nullable=True)
    target_type = Column(String, nullable=True)
    from_status = Column(String, nullable=True)
    to_status = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
