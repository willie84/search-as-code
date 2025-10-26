from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
from services.user_service import UserService
from services.auth_service import AuthService
from api.endpoints.auth import get_current_user, get_current_user_jwt

logger = logging.getLogger(__name__)
router = APIRouter()

class UserRegistration(BaseModel):
    email: str
    password: str
    name: str
    preferences: Optional[Dict[str, Any]] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

@router.post("/register")
async def register_user(user_data: UserRegistration):
    """Register a new user"""
    try:
        user_service = UserService()
        result = user_service.register_user(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name,
            preferences=user_data.preferences
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        
        # Create JWT token for the new user
        auth_service = AuthService()
        token = auth_service.create_jwt_token(
            user_id=result["user_id"],
            user_type="user"
        )
        
        return {
            "success": True,
            "message": "User registered successfully",
            "token": token,
            "user": result["user"]
        }
        
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login_user(login_data: UserLogin):
    """Login user"""
    try:
        user_service = UserService()
        result = user_service.authenticate_user(
            email=login_data.email,
            password=login_data.password
        )
        
        if not result["success"]:
            raise HTTPException(status_code=401, detail=result["error"])
        
        # Create JWT token
        auth_service = AuthService()
        token = auth_service.create_jwt_token(
            user_id=result["user_id"],
            user_type="user"
        )
        
        return {
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": result["user"]
        }
        
    except Exception as e:
        logger.error(f"Error logging in user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile")
async def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user_jwt)):
    """Get current user's profile"""
    try:
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user")
        
        user_service = UserService()
        user_data = user_service.get_user_by_id(user_id)
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "success": True,
            "user": user_data
        }
        
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile")
async def update_user_profile(
    profile_data: UserProfile,
    current_user: Dict[str, Any] = Depends(get_current_user_jwt)
):
    """Update user profile"""
    try:
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user")
        
        user_service = UserService()
        
        # Prepare profile updates
        profile_updates = {}
        if profile_data.name is not None:
            profile_updates["name"] = profile_data.name
        if profile_data.preferences is not None:
            profile_updates["preferences"] = profile_data.preferences
        
        success = user_service.update_user_profile(user_id, profile_updates)
        
        if not success:
            raise HTTPException(status_code=400, detail="Failed to update profile")
        
        # Get updated user data
        updated_user = user_service.get_user_by_id(user_id)
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "user": updated_user
        }
        
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations")
async def get_user_recommendations(current_user: Dict[str, Any] = Depends(get_current_user_jwt)):
    """Get user's recommendation preferences"""
    try:
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user")
        
        user_service = UserService()
        recommendations = user_service.get_user_recommendations(user_id)
        
        return {
            "success": True,
            "recommendations": recommendations
        }
        
    except Exception as e:
        logger.error(f"Error getting user recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/track/behavior")
async def track_user_behavior(
    behavior_type: str,
    data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user_jwt)
):
    """Track user behavior (view, click, search)"""
    try:
        user_id = current_user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user")
        
        if behavior_type not in ["view", "click", "search"]:
            raise HTTPException(status_code=400, detail="Invalid behavior type")
        
        user_service = UserService()
        success = user_service.track_user_behavior(user_id, behavior_type, data)
        
        if not success:
            raise HTTPException(status_code=400, detail="Failed to track behavior")
        
        return {
            "success": True,
            "message": f"{behavior_type} tracked successfully"
        }
        
    except Exception as e:
        logger.error(f"Error tracking user behavior: {e}")
        raise HTTPException(status_code=500, detail=str(e))

