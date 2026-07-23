from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.workspace import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse
import uuid

router = APIRouter()

def format_workspace(w: Workspace):
    return {
        "id": w.id,
        "name": w.name,
        "description": w.description,
        "icon": w.icon or "🚀",
        "color": w.color or "#2563EB",
        "members": w.members or [],
        "projectCount": w.project_count,
        "createdAt": w.created_at,
        "isOwner": w.is_owner,
        "plan": w.plan or "Pro"
    }

@router.get("/")
async def get_workspaces(db: Session = Depends(get_db)):
    workspaces = db.query(Workspace).all()
    return [format_workspace(w) for w in workspaces]

@router.post("/")
async def create_workspace(payload: WorkspaceCreate, db: Session = Depends(get_db)):
    new_id = f"ws-{uuid.uuid4().hex[:6]}"
    w = Workspace(
        id=new_id,
        name=payload.name,
        description=payload.description,
        icon=payload.icon or "🚀",
        color=payload.color or "#2563EB",
        members=payload.members or ["user-1"],
        project_count=0,
        created_at="2024-07-21",
        is_owner=True,
        plan=payload.plan or "Pro"
    )
    db.add(w)
    db.commit()
    db.refresh(w)
    return format_workspace(w)

@router.get("/{workspace_id}")
async def get_workspace(workspace_id: str, db: Session = Depends(get_db)):
    w = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return format_workspace(w)

@router.put("/{workspace_id}")
async def update_workspace(workspace_id: str, payload: dict, db: Session = Depends(get_db)):
    w = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workspace not found")
    for key, val in payload.items():
        if hasattr(w, key):
            setattr(w, key, val)
        elif key == "projectCount":
            w.project_count = val
        elif key == "isOwner":
            w.is_owner = val
    db.commit()
    db.refresh(w)
    return format_workspace(w)

@router.delete("/{workspace_id}")
async def delete_workspace(workspace_id: str, db: Session = Depends(get_db)):
    w = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db.delete(w)
    db.commit()
    return {"message": "Workspace deleted successfully"}
