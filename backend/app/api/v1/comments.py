from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.comment import Comment
from app.models.task import Task
import uuid
import datetime

router = APIRouter()

def format_comment(c: Comment):
    return {
        "id": c.id,
        "taskId": c.task_id,
        "authorId": c.author_id,
        "content": c.content,
        "createdAt": c.created_at,
        "reactions": c.reactions or []
    }

@router.get("/task/{task_id}")
async def get_task_comments(task_id: str, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.task_id == task_id).all()
    return [format_comment(c) for c in comments]

@router.post("/")
async def create_comment(payload: dict, db: Session = Depends(get_db)):
    new_id = f"comment-{uuid.uuid4().hex[:6]}"
    now_iso = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    c = Comment(
        id=new_id,
        task_id=payload.get("taskId"),
        author_id=payload.get("authorId", "user-1"),
        content=payload.get("content", ""),
        created_at=now_iso,
        reactions=[]
    )
    db.add(c)
    
    # Increment commentCount on Task
    task = db.query(Task).filter(Task.id == payload.get("taskId")).first()
    if task:
        task.comment_count = (task.comment_count or 0) + 1
        
    db.commit()
    db.refresh(c)
    return format_comment(c)

@router.delete("/{comment_id}")
async def delete_comment(comment_id: str, db: Session = Depends(get_db)):
    c = db.query(Comment).filter(Comment.id == comment_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(c)
    db.commit()
    return {"message": "Comment deleted successfully"}
