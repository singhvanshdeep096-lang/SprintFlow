from fastapi import Request, HTTPException, status
from app.core.security import verify_token

async def auth_middleware(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    if token.startswith("Bearer "):
        token = token[7:]
    
    user = verify_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    request.state.user = user
