from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_projects():
    return []

@router.post("/")
async def create_project():
    return {}

@router.get("/{project_id}")
async def get_project(project_id: int):
    return {"id": project_id}

@router.put("/{project_id}")
async def update_project(project_id: int):
    return {"id": project_id}

@router.delete("/{project_id}")
async def delete_project(project_id: int):
    return {"message": "Deleted"}
