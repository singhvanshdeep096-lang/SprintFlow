from app.repositories.auth_repository import AuthRepository
from app.core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    def __init__(self, db):
        self.auth_repo = AuthRepository(db)

    def register_user(self, email: str, password: str, full_name: str):
        hashed_password = get_password_hash(password)
        user_data = {
            "email": email,
            "hashed_password": hashed_password,
            "full_name": full_name
        }
        user = self.auth_repo.create_user(user_data)
        token = create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}

    def login_user(self, email: str, password: str):
        user = self.auth_repo.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        token = create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}
