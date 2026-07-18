from sqlalchemy.orm import Session
from app.models.workspace import Workspace
from typing import Optional, List

class WorkspaceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_workspace(self, workspace_id: int) -> Optional[Workspace]:
        return self.db.query(Workspace).filter(Workspace.id == workspace_id).first()

    def get_workspaces(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Workspace]:
        return self.db.query(Workspace).filter(Workspace.owner_id == user_id).offset(skip).limit(limit).all()

    def create_workspace(self, workspace_data: dict) -> Workspace:
        workspace = Workspace(**workspace_data)
        self.db.add(workspace)
        self.db.commit()
        self.db.refresh(workspace)
        return workspace

    def update_workspace(self, workspace_id: int, workspace_data: dict) -> Optional[Workspace]:
        workspace = self.get_workspace(workspace_id)
        if workspace:
            for key, value in workspace_data.items():
                setattr(workspace, key, value)
            self.db.commit()
            self.db.refresh(workspace)
        return workspace

    def delete_workspace(self, workspace_id: int) -> bool:
        workspace = self.get_workspace(workspace_id)
        if workspace:
            self.db.delete(workspace)
            self.db.commit()
            return True
        return False
