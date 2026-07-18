from pydantic import BaseModel

class ColumnBase(BaseModel):
    name: str
    position: int = 0

class ColumnCreate(ColumnBase):
    board_id: int

class ColumnUpdate(BaseModel):
    name: str
    position: int

class ColumnResponse(ColumnBase):
    id: int
    board_id: int

    class Config:
        from_attributes = True
