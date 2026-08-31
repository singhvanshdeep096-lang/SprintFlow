from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate
from app.api.deps import get_current_user, is_admin_user
import uuid

router = APIRouter()

def format_project(p: Project):
    return {
        "id": p.id,
        "workspaceId": p.workspace_id,
        "name": p.name,
        "description": p.description,
        "status": p.status or "active",
        "priority": p.priority or "medium",
        "startDate": p.start_date,
        "dueDate": p.due_date,
        "progress": p.progress or 0,
        "color": p.color or "#2563EB",
        "icon": p.icon or "⚡",
        "members": p.members or [],
        "taskCount": p.task_count or 0,
        "completedTasks": p.completed_tasks or 0,
        "tags": p.tags or []
    }

@router.get("/")
async def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    all_projects = db.query(Project).all()
    if is_admin_user(current_user):
        return [format_project(p) for p in all_projects]
    
    # Non-admin users only see projects where they are in project.members
    user_projects = [
        p for p in all_projects
        if p.members and current_user.id in p.members
    ]
    return [format_project(p) for p in user_projects]

@router.post("/")
async def create_project(payload: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_id = f"proj-{uuid.uuid4().hex[:6]}"
    
    # Initialize members list
    assigned_members = payload.members if payload.members and len(payload.members) > 0 else [current_user.id]
    if current_user.id not in assigned_members and not is_admin_user(current_user):
        assigned_members.append(current_user.id)

    p = Project(
        id=new_id,
        workspace_id=payload.workspaceId or "ws-1",
        name=payload.name,
        description=payload.description,
        status=payload.status or "active",
        priority=payload.priority or "medium",
        start_date=payload.startDate or "2024-07-01",
        due_date=payload.dueDate or "2024-09-30",
        progress=payload.progress or 0,
        color=payload.color or "#2563EB",
        icon=payload.icon or "⚡",
        members=assigned_members,
        task_count=0,
        completed_tasks=0,
        tags=payload.tags or []
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return format_project(p)

@router.get("/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not is_admin_user(current_user) and (not p.members or current_user.id not in p.members):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not assigned to this project"
        )
    return format_project(p)

@router.put("/{project_id}")
async def update_project(project_id: str, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not is_admin_user(current_user) and (not p.members or current_user.id not in p.members):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You cannot modify this project"
        )
    
    mapping = {
        "workspaceId": "workspace_id",
        "startDate": "start_date",
        "dueDate": "due_date",
        "taskCount": "task_count",
        "completedTasks": "completed_tasks",
        "members": "members"
    }

    for key, val in payload.items():
        attr_name = mapping.get(key, key)
        if hasattr(p, attr_name):
            setattr(p, attr_name, val)

    db.commit()
    db.refresh(p)
    return format_project(p)

@router.post("/{project_id}/members")
async def add_project_members(project_id: str, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not is_admin_user(current_user) and (not p.members or current_user.id not in p.members):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or project member permissions required")
    
    user_ids = payload.get("userIds")
    if not user_ids and payload.get("userId"):
        user_ids = [payload.get("userId")]
        
    if not user_ids:
        raise HTTPException(status_code=400, detail="userId or userIds required")
        
    current_members = list(p.members or [])
    for uid in user_ids:
        if uid and uid not in current_members:
            current_members.append(uid)
            
    p.members = current_members
    db.commit()
    db.refresh(p)
    return format_project(p)

@router.delete("/{project_id}/members/{user_id}")
async def remove_project_member(project_id: str, user_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not is_admin_user(current_user) and (not p.members or current_user.id not in p.members):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin or project member permissions required")
        
    current_members = list(p.members or [])
    if user_id in current_members:
        current_members.remove(user_id)
        p.members = current_members
        db.commit()
        db.refresh(p)
        
    return format_project(p)

@router.delete("/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if not is_admin_user(current_user) and (not p.members or current_user.id not in p.members):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    db.delete(p)
    db.commit()
    return {"message": "Project deleted successfully"}

