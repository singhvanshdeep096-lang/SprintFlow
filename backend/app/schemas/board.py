from pydantic import BaseModel
from datetime import datetime

class BoardBase(BaseModel):
    name: str

class BoardCreate(BoardBase):
    project_id: int

class BoardUpdate(BaseModel):
    name: str

class BoardResponse(BoardBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True
