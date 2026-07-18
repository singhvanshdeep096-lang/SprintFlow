from sqlalchemy.orm import Session
from app.models.comment import Comment
from typing import Optional, List

class CommentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_comment(self, comment_id: int) -> Optional[Comment]:
        return self.db.query(Comment).filter(Comment.id == comment_id).first()

    def get_comments(self, task_id: int, skip: int = 0, limit: int = 100) -> List[Comment]:
        return self.db.query(Comment).filter(Comment.task_id == task_id).offset(skip).limit(limit).all()

    def create_comment(self, comment_data: dict) -> Comment:
        comment = Comment(**comment_data)
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def delete_comment(self, comment_id: int) -> bool:
        comment = self.get_comment(comment_id)
        if comment:
            self.db.delete(comment)
            self.db.commit()
            return True
        return False
