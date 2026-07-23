from sqlalchemy import Column, String, JSON, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, index=True)
    task_id = Column(String, index=True)
    author_id = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(String, nullable=True)
    reactions = Column(JSON, default=[])
