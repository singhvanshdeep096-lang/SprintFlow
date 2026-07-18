from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_notifications():
    return []

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: int):
    return {"id": notification_id}
