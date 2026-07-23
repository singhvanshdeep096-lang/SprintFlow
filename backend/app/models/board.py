from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Board(Base):
    __tablename__ = "boards"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    project_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
