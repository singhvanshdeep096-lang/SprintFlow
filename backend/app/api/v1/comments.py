from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_comments():
    return []

@router.post("/")
async def create_comment():
    return {}

@router.delete("/{comment_id}")
async def delete_comment(comment_id: int):
    return {"message": "Deleted"}
