from app.core.security import verify_password, create_access_token

def authenticate_user(email: str, password: str):
    # TODO: Implement actual user authentication
    if email == "test@example.com" and password == "password":
        return {"id": 1, "email": email}
    return None
