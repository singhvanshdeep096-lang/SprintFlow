from app.repositories.notification_repository import NotificationRepository

class NotificationService:
    def __init__(self, db):
        self.notification_repo = NotificationRepository(db)

    def get_notification(self, notification_id: int):
        return self.notification_repo.get_notification(notification_id)

    def get_notifications(self, user_id: int, skip: int = 0, limit: int = 100):
        return self.notification_repo.get_notifications(user_id, skip, limit)

    def create_notification(self, notification_data: dict):
        return self.notification_repo.create_notification(notification_data)

    def mark_as_read(self, notification_id: int):
        return self.notification_repo.mark_as_read(notification_id)
