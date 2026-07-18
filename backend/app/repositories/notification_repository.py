from sqlalchemy.orm import Session
from app.models.notification import Notification
from typing import Optional, List

class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_notification(self, notification_id: int) -> Optional[Notification]:
        return self.db.query(Notification).filter(Notification.id == notification_id).first()

    def get_notifications(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Notification]:
        return self.db.query(Notification).filter(Notification.user_id == user_id).offset(skip).limit(limit).all()

    def create_notification(self, notification_data: dict) -> Notification:
        notification = Notification(**notification_data)
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def mark_as_read(self, notification_id: int) -> Optional[Notification]:
        notification = self.get_notification(notification_id)
        if notification:
            notification.is_read = True
            self.db.commit()
            self.db.refresh(notification)
        return notification
