import hashlib
import secrets
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

class AuthService:
    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
        self.admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        self.session_tokens = {}  # In production, use Redis or database
        
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return self.hash_password(password) == hashed
    
    def generate_session_token(self) -> str:
        """Generate a secure session token"""
        return secrets.token_urlsafe(32)
    
    def create_jwt_token(self, user_id: str, user_type: str = "user") -> str:
        """Create JWT token for user"""
        payload = {
            "user_id": user_id,
            "user_type": user_type,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, self.secret_key, algorithm="HS256")
    
    def verify_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def authenticate_admin(self, password: str) -> Optional[str]:
        """Authenticate admin user"""
        if self.verify_password(password, self.hash_password(self.admin_password)):
            return self.create_jwt_token("admin", "admin")
        return None
    
    def authenticate_user(self, session_id: str = None) -> str:
        """Authenticate or create anonymous user"""
        if not session_id:
            session_id = self.generate_session_token()
        
        # Store session
        self.session_tokens[session_id] = {
            "user_id": f"user_{session_id[:8]}",
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow()
        }
        
        return session_id
    
    def get_user_id(self, session_id: str) -> Optional[str]:
        """Get user ID from session"""
        if session_id in self.session_tokens:
            self.session_tokens[session_id]["last_activity"] = datetime.utcnow()
            return self.session_tokens[session_id]["user_id"]
        return None
    
    def is_admin(self, token: str) -> bool:
        """Check if user is admin"""
        payload = self.verify_jwt_token(token)
        return payload and payload.get("user_type") == "admin"
