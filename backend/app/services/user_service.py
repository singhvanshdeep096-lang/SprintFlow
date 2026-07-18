from app.repositories.user_repository import UserRepository

class UserService:
    def __init__(self, db):
        self.user_repo = UserRepository(db)

    def get_user(self, user_id: int):
        return self.user_repo.get_user(user_id)

    def get_users(self, skip: int = 0, limit: int = 100):
        return self.user_repo.get_users(skip, limit)

    def update_user(self, user_id: int, user_data: dict):
        return self.user_repo.update_user(user_id, user_data)
