from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Column(Base):
    __tablename__ = "columns"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_id = Column(String, nullable=True)
    position = Column(Integer, default=0)
