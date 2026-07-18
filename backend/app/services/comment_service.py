from app.repositories.comment_repository import CommentRepository

class CommentService:
    def __init__(self, db):
        self.comment_repo = CommentRepository(db)

    def get_comment(self, comment_id: int):
        return self.comment_repo.get_comment(comment_id)

    def get_comments(self, task_id: int, skip: int = 0, limit: int = 100):
        return self.comment_repo.get_comments(task_id, skip, limit)

    def create_comment(self, comment_data: dict):
        return self.comment_repo.create_comment(comment_data)

    def delete_comment(self, comment_id: int):
        return self.comment_repo.delete_comment(comment_id)
