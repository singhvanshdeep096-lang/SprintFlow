from sqlalchemy.orm import Session
from app.models.task import Task
from typing import Optional, List

class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_task(self, task_id: int) -> Optional[Task]:
        return self.db.query(Task).filter(Task.id == task_id).first()

    def get_tasks(self, column_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
        return self.db.query(Task).filter(Task.column_id == column_id).offset(skip).limit(limit).all()

    def create_task(self, task_data: dict) -> Task:
        task = Task(**task_data)
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self, task_id: int, task_data: dict) -> Optional[Task]:
        task = self.get_task(task_id)
        if task:
            for key, value in task_data.items():
                setattr(task, key, value)
            self.db.commit()
            self.db.refresh(task)
        return task

    def delete_task(self, task_id: int) -> bool:
        task = self.get_task(task_id)
        if task:
            self.db.delete(task)
            self.db.commit()
            return True
        return False
