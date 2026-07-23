from sqlalchemy import Column, Integer, String, JSON, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, default="🚀")
    color = Column(String, default="#2563EB")
    owner_id = Column(String, nullable=True)
    members = Column(JSON, default=[])
    project_count = Column(Integer, default=0)
    created_at = Column(String, nullable=True)
    is_owner = Column(Boolean, default=True)
    plan = Column(String, default="Pro")
