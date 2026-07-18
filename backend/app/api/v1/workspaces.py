from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_workspaces():
    return []

@router.post("/")
async def create_workspace():
    return {}

@router.get("/{workspace_id}")
async def get_workspace(workspace_id: int):
    return {"id": workspace_id}

@router.put("/{workspace_id}")
async def update_workspace(workspace_id: int):
    return {"id": workspace_id}

@router.delete("/{workspace_id}")
async def delete_workspace(workspace_id: int):
    return {"message": "Deleted"}
