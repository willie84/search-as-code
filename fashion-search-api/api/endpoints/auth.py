from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from services.auth_service import AuthService
from typing import Optional

router = APIRouter()
auth_service = AuthService()

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    token: str
    user_type: str

class SessionResponse(BaseModel):
    session_id: str
    user_id: str

@router.post("/login", response_model=LoginResponse)
async def admin_login(request: LoginRequest):
    """Admin login endpoint"""
    token = auth_service.authenticate_admin(request.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return LoginResponse(token=token, user_type="admin")

@router.post("/session", response_model=SessionResponse)
async def create_user_session(session_id: Optional[str] = None):
    """Create or get user session for anonymous users"""
    if not session_id:
        session_id = auth_service.authenticate_user()
    else:
        auth_service.authenticate_user(session_id)
    
    user_id = auth_service.get_user_id(session_id)
    return SessionResponse(session_id=session_id, user_id=user_id)

def get_current_admin(authorization: str = Header(None)):
    """Dependency to get current admin user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    if not auth_service.is_admin(token):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return token

def get_current_user(session_id: str = Header(None, alias="X-Session-ID")):
    """Dependency to get current user (admin or regular user)"""
    if not session_id:
        raise HTTPException(status_code=401, detail="Session ID required")
    
    user_id = auth_service.get_user_id(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return {"user_id": user_id, "session_id": session_id}

def get_current_user_jwt(authorization: str = Header(None)):
    """Dependency to get current user from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    payload = auth_service.verify_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return payload
