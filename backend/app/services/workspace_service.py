from app.repositories.workspace_repository import WorkspaceRepository

class WorkspaceService:
    def __init__(self, db):
        self.workspace_repo = WorkspaceRepository(db)

    def get_workspace(self, workspace_id: int):
        return self.workspace_repo.get_workspace(workspace_id)

    def get_workspaces(self, user_id: int, skip: int = 0, limit: int = 100):
        return self.workspace_repo.get_workspaces(user_id, skip, limit)

    def create_workspace(self, workspace_data: dict):
        return self.workspace_repo.create_workspace(workspace_data)

    def update_workspace(self, workspace_id: int, workspace_data: dict):
        return self.workspace_repo.update_workspace(workspace_id, workspace_data)

    def delete_workspace(self, workspace_id: int):
        return self.workspace_repo.delete_workspace(workspace_id)
