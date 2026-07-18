from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, workspaces, projects, tasks, comments, notifications, reports, attachments

app = FastAPI(title="SprintFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(workspaces.router, prefix="/api/v1/workspaces", tags=["workspaces"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(comments.router, prefix="/api/v1/comments", tags=["comments"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(attachments.router, prefix="/api/v1/attachments", tags=["attachments"])

@app.get("/")
async def root():
    return {"message": "SprintFlow API"}
