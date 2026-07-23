from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(String, nullable=True)
    link = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    avatar_color = Column(String, nullable=True)
    is_system_notif = Column(Boolean, default=False)
    user_id = Column(String, nullable=True)
