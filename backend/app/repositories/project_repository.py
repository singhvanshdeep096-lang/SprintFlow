from sqlalchemy.orm import Session
from app.models.project import Project
from typing import Optional, List

class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_project(self, project_id: int) -> Optional[Project]:
        return self.db.query(Project).filter(Project.id == project_id).first()

    def get_projects(self, workspace_id: int, skip: int = 0, limit: int = 100) -> List[Project]:
        return self.db.query(Project).filter(Project.workspace_id == workspace_id).offset(skip).limit(limit).all()

    def create_project(self, project_data: dict) -> Project:
        project = Project(**project_data)
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update_project(self, project_id: int, project_data: dict) -> Optional[Project]:
        project = self.get_project(project_id)
        if project:
            for key, value in project_data.items():
                setattr(project, key, value)
            self.db.commit()
            self.db.refresh(project)
        return project

    def delete_project(self, project_id: int) -> bool:
        project = self.get_project(project_id)
        if project:
            self.db.delete(project)
            self.db.commit()
            return True
        return False
