from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

router = APIRouter()

@router.get("/")
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id, "name": u.name, "email": u.email,
            "avatar": u.avatar, "initials": u.initials, "role": u.role,
            "department": u.department, "color": u.color or "#2563EB"
        }
        for u in users
    ]
