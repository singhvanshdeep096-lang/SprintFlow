from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate
import uuid
import datetime

router = APIRouter()

def format_task(t: Task):
    return {
        "id": t.id,
        "projectId": t.project_id,
        "title": t.title,
        "description": t.description,
        "status": t.status or "todo",
        "priority": t.priority or "medium",
        "assigneeId": t.assignee_id,
        "reporterId": t.reporter_id,
        "labels": t.labels or [],
        "dueDate": t.due_date,
        "createdAt": t.created_at,
        "updatedAt": t.updated_at,
        "commentCount": t.comment_count or 0,
        "attachmentCount": t.attachment_count or 0,
        "subtasks": t.subtasks or [],
        "estimatedHours": t.estimated_hours or 0,
        "loggedHours": t.logged_hours or 0
    }

@router.get("/")
async def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return [format_task(t) for t in tasks]

@router.post("/")
async def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    new_id = f"task-{uuid.uuid4().hex[:6]}"
    now_str = datetime.date.today().isoformat()
    t = Task(
        id=new_id,
        project_id=payload.projectId or "proj-1",
        title=payload.title,
        description=payload.description,
        status=payload.status or "todo",
        priority=payload.priority or "medium",
        assignee_id=payload.assigneeId or "user-1",
        reporter_id=payload.reporterId or "user-1",
        labels=payload.labels or [],
        due_date=payload.dueDate or "2024-08-30",
        created_at=now_str,
        updated_at=now_str,
        comment_count=0,
        attachment_count=0,
        subtasks=payload.subtasks or [],
        estimated_hours=payload.estimatedHours or 8,
        logged_hours=payload.loggedHours or 0
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return format_task(t)

@router.get("/{task_id}")
async def get_task(task_id: str, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return format_task(t)

@router.put("/{task_id}")
async def update_task(task_id: str, payload: dict, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    
    mapping = {
        "projectId": "project_id",
        "assigneeId": "assignee_id",
        "reporterId": "reporter_id",
        "dueDate": "due_date",
        "commentCount": "comment_count",
        "attachmentCount": "attachment_count",
        "estimatedHours": "estimated_hours",
        "loggedHours": "logged_hours",
        "updatedAt": "updated_at"
    }

    t.updated_at = datetime.date.today().isoformat()

    for key, val in payload.items():
        attr_name = mapping.get(key, key)
        if hasattr(t, attr_name):
            setattr(t, attr_name, val)

    db.commit()
    db.refresh(t)
    return format_task(t)

@router.patch("/{task_id}/status")
async def update_task_status(task_id: str, payload: dict, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if "status" in payload:
        t.status = payload["status"]
        t.updated_at = datetime.date.today().isoformat()
        db.commit()
        db.refresh(t)
    return format_task(t)

@router.delete("/{task_id}")
async def delete_task(task_id: str, db: Session = Depends(get_db)):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(t)
    db.commit()
    return {"message": "Task deleted successfully"}
