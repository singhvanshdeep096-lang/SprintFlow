from app.repositories.project_repository import ProjectRepository

class ProjectService:
    def __init__(self, db):
        self.project_repo = ProjectRepository(db)

    def get_project(self, project_id: int):
        return self.project_repo.get_project(project_id)

    def get_projects(self, workspace_id: int, skip: int = 0, limit: int = 100):
        return self.project_repo.get_projects(workspace_id, skip, limit)

    def create_project(self, project_data: dict):
        return self.project_repo.create_project(project_data)

    def update_project(self, project_id: int, project_data: dict):
        return self.project_repo.update_project(project_id, project_data)

    def delete_project(self, project_id: int):
        return self.project_repo.delete_project(project_id)
