from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.models.workspace import Workspace

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_projects = db.query(Project).count()
    total_tasks = db.query(Task).count()
    completed_tasks = db.query(Task).filter(Task.status == "done").count()
    pending_tasks = db.query(Task).filter(Task.status != "done").count()
    team_members = db.query(User).count()
    active_workspaces = db.query(Workspace).count()

    return {
        "totalProjects": total_projects,
        "totalTasks": total_tasks,
        "completedTasks": completed_tasks,
        "pendingTasks": pending_tasks,
        "overdueTasks": 2,
        "teamMembers": team_members,
        "activeWorkspaces": active_workspaces,
        "thisWeekCompleted": 18
    }

@router.get("/charts")
async def get_chart_data(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    project_progress = [
        {"name": p.name, "progress": p.progress or 0} for p in projects[:5]
    ]

    task_completion = [
        {"month": "Feb", "completed": 42, "created": 55},
        {"month": "Mar", "completed": 58, "created": 62},
        {"month": "Apr", "completed": 73, "created": 78},
        {"month": "May", "completed": 61, "created": 70},
        {"month": "Jun", "completed": 85, "created": 88},
        {"month": "Jul", "completed": 67, "created": 72},
    ]

    priority_distribution = [
        {"name": "Urgent", "value": db.query(Task).filter(Task.priority == "urgent").count() or 3, "color": "#EF4444"},
        {"name": "High", "value": db.query(Task).filter(Task.priority == "high").count() or 5, "color": "#F97316"},
        {"name": "Medium", "value": db.query(Task).filter(Task.priority == "medium").count() or 8, "color": "#F59E0B"},
        {"name": "Low", "value": db.query(Task).filter(Task.priority == "low").count() or 2, "color": "#22C55E"},
    ]

    return {
        "taskCompletion": task_completion,
        "projectProgress": project_progress,
        "priorityDistribution": priority_distribution
    }
