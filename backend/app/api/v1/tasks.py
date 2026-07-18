from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_tasks():
    return []

@router.post("/")
async def create_task():
    return {}

@router.get("/{task_id}")
async def get_task(task_id: int):
    return {"id": task_id}

@router.put("/{task_id}")
async def update_task(task_id: int):
    return {"id": task_id}

@router.delete("/{task_id}")
async def delete_task(task_id: int):
    return {"message": "Deleted"}
