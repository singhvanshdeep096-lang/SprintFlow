from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate
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
async def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return [format_project(p) for p in projects]

@router.post("/")
async def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    new_id = f"proj-{uuid.uuid4().hex[:6]}"
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
        members=payload.members or ["user-1"],
        task_count=0,
        completed_tasks=0,
        tags=payload.tags or []
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return format_project(p)

@router.get("/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return format_project(p)

@router.put("/{project_id}")
async def update_project(project_id: str, payload: dict, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    mapping = {
        "workspaceId": "workspace_id",
        "startDate": "start_date",
        "dueDate": "due_date",
        "taskCount": "task_count",
        "completedTasks": "completed_tasks"
    }

    for key, val in payload.items():
        attr_name = mapping.get(key, key)
        if hasattr(p, attr_name):
            setattr(p, attr_name, val)

    db.commit()
    db.refresh(p)
    return format_project(p)

@router.delete("/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p)
    db.commit()
    return {"message": "Project deleted successfully"}
