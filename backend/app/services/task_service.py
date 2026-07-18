from app.repositories.task_repository import TaskRepository

class TaskService:
    def __init__(self, db):
        self.task_repo = TaskRepository(db)

    def get_task(self, task_id: int):
        return self.task_repo.get_task(task_id)

    def get_tasks(self, column_id: int, skip: int = 0, limit: int = 100):
        return self.task_repo.get_tasks(column_id, skip, limit)

    def create_task(self, task_data: dict):
        return self.task_repo.create_task(task_data)

    def update_task(self, task_id: int, task_data: dict):
        return self.task_repo.update_task(task_id, task_data)

    def delete_task(self, task_id: int):
        return self.task_repo.delete_task(task_id)
