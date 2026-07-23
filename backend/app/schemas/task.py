from pydantic import BaseModel
from typing import Optional, List, Any

class SubTask(BaseModel):
    id: str
    title: str
    done: bool = False

class TaskBase(BaseModel):
    projectId: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    assigneeId: Optional[str] = None
    reporterId: Optional[str] = None
    labels: Optional[List[str]] = []
    dueDate: Optional[str] = None
    subtasks: Optional[List[Any]] = []
    estimatedHours: Optional[int] = 0
    loggedHours: Optional[int] = 0

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    commentCount: Optional[int] = 0
    attachmentCount: Optional[int] = 0

    class Config:
        from_attributes = True
