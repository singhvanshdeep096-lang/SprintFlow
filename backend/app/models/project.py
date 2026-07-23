from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="active")
    priority = Column(String, default="medium")
    start_date = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    color = Column(String, default="#2563EB")
    icon = Column(String, default="⚡")
    members = Column(JSON, default=[])
    task_count = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)
    tags = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
