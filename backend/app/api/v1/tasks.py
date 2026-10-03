from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.task import TaskCreate
from app.api.deps import get_current_user, is_admin_user
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
        "loggedHours": t.logged_hours or 0,
        "onBoard": t.on_board if t.on_board is not None else True
    }

@router.get("/")
async def get_tasks(
    project_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = is_admin_user(current_user)
    
    if is_admin:
        if project_id:
            tasks = db.query(Task).filter(Task.project_id == project_id).all()
        else:
            tasks = db.query(Task).all()
        return [format_task(t) for t in tasks]

    # Non-admin users only see tasks belonging to their assigned projects
    all_projects = db.query(Project).all()
    user_project_ids = [p.id for p in all_projects if p.members and current_user.id in p.members]

    if project_id:
        if project_id not in user_project_ids:
            return []
        tasks = db.query(Task).filter(Task.project_id == project_id).all()
    else:
        tasks = db.query(Task).filter(
            (Task.project_id.in_(user_project_ids)) |
            (Task.assignee_id == current_user.id) |
            (Task.reporter_id == current_user.id)
        ).all()

    return [format_task(t) for t in tasks]

@router.post("/")
async def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_project_id = payload.projectId or "proj-1"
    
    # Check if project exists and user has access
    p = db.query(Project).filter(Project.id == target_project_id).first()
    if p and not is_admin_user(current_user):
        if not p.members or current_user.id not in p.members:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You cannot create tasks in a project you are not a member of"
            )

    new_id = f"task-{uuid.uuid4().hex[:6]}"
    now_str = datetime.date.today().isoformat()
    t = Task(
        id=new_id,
        project_id=target_project_id,
        title=payload.title,
        description=payload.description,
        status=payload.status or "todo",
        priority=payload.priority or "medium",
        assignee_id=payload.assigneeId or current_user.id,
        reporter_id=payload.reporterId or current_user.id,
        labels=payload.labels or [],
        due_date=payload.dueDate or "2024-08-30",
        created_at=now_str,
        updated_at=now_str,
        comment_count=0,
        attachment_count=0,
        subtasks=payload.subtasks or [],
        estimated_hours=payload.estimatedHours or 8,
        logged_hours=payload.loggedHours or 0,
        on_board=payload.onBoard if payload.onBoard is not None else True
    )
    db.add(t)
    
    # Increment project task_count
    if p:
        p.task_count = (p.task_count or 0) + 1
        
    db.commit()
    db.refresh(t)
    return format_task(t)

@router.get("/{task_id}")
async def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if not is_admin_user(current_user):
        p = db.query(Project).filter(Project.id == t.project_id).first()
        is_member = p and p.members and current_user.id in p.members
        is_involved = t.assignee_id == current_user.id or t.reporter_id == current_user.id
        if not is_member and not is_involved:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
    return format_task(t)

@router.put("/{task_id}")
async def update_task(
    task_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
        "updatedAt": "updated_at",
        "onBoard": "on_board"
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
async def update_task_status(
    task_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if "status" in payload:
        t.status = payload["status"]
        t.updated_at = datetime.date.today().isoformat()
        
        # Check if project completed_tasks count should be refreshed
        p = db.query(Project).filter(Project.id == t.project_id).first()
        if p:
            completed_count = db.query(Task).filter(Task.project_id == p.id, Task.status == "done").count()
            p.completed_tasks = completed_count
            if p.task_count and p.task_count > 0:
                p.progress = min(100, int((completed_count / p.task_count) * 100))
                
        db.commit()
        db.refresh(t)
    return format_task(t)

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not is_admin_user(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only administrators have access to delete tasks and tickets"
        )

    t = db.query(Task).filter(Task.id == task_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
        
    p = db.query(Project).filter(Project.id == t.project_id).first()
    if p and (p.task_count or 0) > 0:
        p.task_count = max(0, (p.task_count or 1) - 1)
        if t.status == "done":
            p.completed_tasks = max(0, (p.completed_tasks or 1) - 1)
        if p.task_count > 0:
            p.progress = min(100, int(((p.completed_tasks or 0) / p.task_count) * 100))
        else:
            p.progress = 0
        
    db.delete(t)
    db.commit()
    return {"message": "Task deleted successfully"}

