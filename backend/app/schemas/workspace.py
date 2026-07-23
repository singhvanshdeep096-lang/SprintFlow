from pydantic import BaseModel
from typing import Optional, List

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "🚀"
    color: Optional[str] = "#2563EB"
    members: Optional[List[str]] = []
    plan: Optional[str] = "Pro"

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: str
    owner_id: Optional[str] = None
    projectCount: Optional[int] = 0
    createdAt: Optional[str] = None
    isOwner: Optional[bool] = True

    class Config:
        from_attributes = True
