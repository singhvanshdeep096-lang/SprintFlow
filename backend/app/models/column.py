from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Column(Base):
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("boards.id"))
    position = Column(Integer, default=0)

    board = relationship("Board", back_populates="columns")
