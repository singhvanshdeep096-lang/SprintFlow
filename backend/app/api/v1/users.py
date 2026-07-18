from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_users():
    return []

@router.get("/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id}

@router.put("/{user_id}")
async def update_user(user_id: int):
    return {"id": user_id}
