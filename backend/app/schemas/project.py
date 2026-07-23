from pydantic import BaseModel
from typing import Optional, List

class ProjectBase(BaseModel):
    workspaceId: Optional[str] = None
    name: str
    description: Optional[str] = None
    status: Optional[str] = "active"
    priority: Optional[str] = "medium"
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    progress: Optional[int] = 0
    color: Optional[str] = "#2563EB"
    icon: Optional[str] = "⚡"
    members: Optional[List[str]] = []
    tags: Optional[List[str]] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    taskCount: Optional[int] = 0
    completedTasks: Optional[int] = 0

    class Config:
        from_attributes = True
