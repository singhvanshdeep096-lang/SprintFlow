from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"

class TaskCreate(TaskBase):
    column_id: int
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    column_id: int
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
