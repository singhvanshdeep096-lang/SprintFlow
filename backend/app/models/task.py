from sqlalchemy import Column, Integer, String, JSON, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="todo")
    priority = Column(String, default="medium")
    assignee_id = Column(String, nullable=True)
    reporter_id = Column(String, nullable=True)
    labels = Column(JSON, default=[])
    due_date = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)
    comment_count = Column(Integer, default=0)
    attachment_count = Column(Integer, default=0)
    subtasks = Column(JSON, default=[])
    estimated_hours = Column(Integer, default=0)
    logged_hours = Column(Integer, default=0)
