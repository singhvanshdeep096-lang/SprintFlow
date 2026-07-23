from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.notification import Notification

router = APIRouter()

def format_notification(n: Notification):
    return {
        "id": n.id,
        "type": n.type,
        "title": n.title,
        "description": n.description,
        "isRead": n.is_read,
        "createdAt": n.created_at,
        "link": n.link,
        "avatar": n.avatar,
        "avatarColor": n.avatar_color,
        "isSystemNotif": n.is_system_notif
    }

@router.get("/")
async def get_notifications(db: Session = Depends(get_db)):
    notifications = db.query(Notification).all()
    return [format_notification(n) for n in notifications]

@router.patch("/{notification_id}/read")
async def mark_as_read(notification_id: str, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    db.refresh(n)
    return format_notification(n)

@router.patch("/mark-all-read")
async def mark_all_as_read(db: Session = Depends(get_db)):
    db.query(Notification).update({Notification.is_read: True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(n)
    db.commit()
    return {"message": "Notification deleted successfully"}
