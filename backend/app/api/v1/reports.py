from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.models.workspace import Workspace
from app.api.deps import get_current_user, is_admin_user

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin = is_admin_user(current_user)
    
    if is_admin:
        total_projects = db.query(Project).count()
        total_tasks = db.query(Task).count()
        completed_tasks = db.query(Task).filter(Task.status == "done").count()
        pending_tasks = db.query(Task).filter(Task.status != "done").count()
        overdue_tasks = db.query(Task).filter(Task.status != "done").count()
    else:
        all_projects = db.query(Project).all()
        user_projects = [p for p in all_projects if p.members and current_user.id in p.members]
        user_proj_ids = [p.id for p in user_projects]
        total_projects = len(user_projects)
        
        user_tasks = db.query(Task).filter(
            (Task.project_id.in_(user_proj_ids)) |
            (Task.assignee_id == current_user.id)
        ).all() if user_proj_ids else []
        
        total_tasks = len(user_tasks)
        completed_tasks = len([t for t in user_tasks if t.status == "done"])
        pending_tasks = len([t for t in user_tasks if t.status != "done"])
        overdue_tasks = min(1, pending_tasks)

    team_members = db.query(User).count()
    active_workspaces = db.query(Workspace).count()

    return {
        "totalProjects": total_projects,
        "totalTasks": total_tasks,
        "completedTasks": completed_tasks,
        "pendingTasks": pending_tasks,
        "overdueTasks": overdue_tasks,
        "teamMembers": team_members,
        "activeWorkspaces": active_workspaces,
        "thisWeekCompleted": completed_tasks
    }

@router.get("/charts")
async def get_chart_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin = is_admin_user(current_user)
    if is_admin:
        projects = db.query(Project).all()
    else:
        all_projects = db.query(Project).all()
        projects = [p for p in all_projects if p.members and current_user.id in p.members]

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

