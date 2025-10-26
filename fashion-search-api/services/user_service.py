import json
import os
import hashlib
import secrets
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self):
        self.users_file = "data/users.json"
        self.users_data = self._load_users_data()
    
    def _load_users_data(self) -> Dict[str, Any]:
        """Load users data from file"""
        if os.path.exists(self.users_file):
            try:
                with open(self.users_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading users data: {e}")
        return {"users": {}, "next_user_id": 1}
    
    def _save_users_data(self):
        """Save users data to file"""
        try:
            os.makedirs(os.path.dirname(self.users_file), exist_ok=True)
            with open(self.users_file, 'w') as f:
                json.dump(self.users_data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving users data: {e}")
    
    def _hash_password(self, password: str) -> str:
        """Hash password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    def _verify_password(self, password: str, stored_hash: str) -> bool:
        """Verify password against stored hash"""
        try:
            salt, password_hash = stored_hash.split(':')
            return hashlib.sha256((password + salt).encode()).hexdigest() == password_hash
        except:
            return False
    
    def register_user(self, email: str, password: str, name: str, preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """Register a new user"""
        try:
            # Check if user already exists
            for user_id, user_data in self.users_data["users"].items():
                if user_data.get("email") == email:
                    return {"success": False, "error": "User already exists"}
            
            # Create new user
            user_id = str(self.users_data["next_user_id"])
            self.users_data["next_user_id"] += 1
            
            user_data = {
                "user_id": user_id,
                "email": email,
                "name": name,
                "password_hash": self._hash_password(password),
                "preferences": preferences or {},
                "created_at": datetime.now().isoformat(),
                "last_login": None,
                "profile": {
                    "favorite_categories": [],
                    "price_range": {"min": 0, "max": 1000},
                    "interests": [],
                    "search_history": [],
                    "viewed_products": [],
                    "clicked_products": []
                }
            }
            
            self.users_data["users"][user_id] = user_data
            self._save_users_data()
            
            logger.info(f"User registered: {email}")
            return {
                "success": True,
                "user_id": user_id,
                "user": {
                    "user_id": user_id,
                    "email": email,
                    "name": name,
                    "preferences": user_data["preferences"],
                    "profile": user_data["profile"]
                }
            }
            
        except Exception as e:
            logger.error(f"Error registering user: {e}")
            return {"success": False, "error": str(e)}
    
    def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user login"""
        try:
            # Find user by email
            user_data = None
            user_id = None
            for uid, udata in self.users_data["users"].items():
                if udata.get("email") == email:
                    user_data = udata
                    user_id = uid
                    break
            
            if not user_data:
                return {"success": False, "error": "User not found"}
            
            # Verify password
            if not self._verify_password(password, user_data["password_hash"]):
                return {"success": False, "error": "Invalid password"}
            
            # Update last login
            user_data["last_login"] = datetime.now().isoformat()
            self._save_users_data()
            
            logger.info(f"User authenticated: {email}")
            return {
                "success": True,
                "user_id": user_id,
                "user": {
                    "user_id": user_id,
                    "email": email,
                    "name": user_data["name"],
                    "preferences": user_data["preferences"],
                    "profile": user_data["profile"]
                }
            }
            
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return {"success": False, "error": str(e)}
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            user_data = self.users_data["users"].get(user_id)
            if not user_data:
                return None
            
            return {
                "user_id": user_id,
                "email": user_data["email"],
                "name": user_data["name"],
                "preferences": user_data["preferences"],
                "profile": user_data["profile"],
                "created_at": user_data["created_at"],
                "last_login": user_data["last_login"]
            }
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None
    
    def update_user_profile(self, user_id: str, profile_updates: Dict[str, Any]) -> bool:
        """Update user profile"""
        try:
            if user_id not in self.users_data["users"]:
                return False
            
            user_data = self.users_data["users"][user_id]
            
            # Update profile fields
            for key, value in profile_updates.items():
                if key in user_data["profile"]:
                    if key in ["viewed_products", "clicked_products", "search_history"]:
                        # Append to lists, keep only last 100 items
                        user_data["profile"][key].extend(value if isinstance(value, list) else [value])
                        user_data["profile"][key] = user_data["profile"][key][-100:]
                    else:
                        user_data["profile"][key] = value
            
            self._save_users_data()
            logger.info(f"Updated profile for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating user profile: {e}")
            return False
    
    def track_user_behavior(self, user_id: str, behavior_type: str, data: Dict[str, Any]):
        """Track user behavior (view, click, search)"""
        try:
            if user_id not in self.users_data["users"]:
                return False
            
            user_data = self.users_data["users"][user_id]
            timestamp = datetime.now().isoformat()
            
            behavior_entry = {
                "timestamp": timestamp,
                "data": data
            }
            
            if behavior_type == "view":
                user_data["profile"]["viewed_products"].append(behavior_entry)
                # Keep only last 100 views
                user_data["profile"]["viewed_products"] = user_data["profile"]["viewed_products"][-100:]
                
            elif behavior_type == "click":
                user_data["profile"]["clicked_products"].append(behavior_entry)
                # Keep only last 50 clicks
                user_data["profile"]["clicked_products"] = user_data["profile"]["clicked_products"][-50:]
                
            elif behavior_type == "search":
                user_data["profile"]["search_history"].append(behavior_entry)
                # Keep only last 30 searches
                user_data["profile"]["search_history"] = user_data["profile"]["search_history"][-30:]
            
            self._save_users_data()
            return True
            
        except Exception as e:
            logger.error(f"Error tracking user behavior: {e}")
            return False
    
    def get_user_recommendations(self, user_id: str) -> Dict[str, Any]:
        """Get user's recommendation preferences based on their behavior"""
        try:
            user_data = self.get_user_by_id(user_id)
            if not user_data:
                return {}
            
            profile = user_data["profile"]
            
            # Analyze behavior to create recommendations
            recommendations = {
                "favorite_categories": {},
                "price_range": {"min": 0, "max": 1000},
                "recent_interests": [],
                "search_patterns": []
            }
            
            # Analyze viewed products
            for view in profile.get("viewed_products", []):
                product_data = view.get("data", {})
                category = product_data.get("category", "")
                price = product_data.get("price", 0)
                
                if category:
                    recommendations["favorite_categories"][category] = recommendations["favorite_categories"].get(category, 0) + 1
                
                if price > 0:
                    if recommendations["price_range"]["min"] == 0:
                        recommendations["price_range"]["min"] = price
                    else:
                        recommendations["price_range"]["min"] = min(recommendations["price_range"]["min"], price)
                    recommendations["price_range"]["max"] = max(recommendations["price_range"]["max"], price)
            
            # Analyze clicked products (higher weight)
            for click in profile.get("clicked_products", []):
                product_data = click.get("data", {})
                category = product_data.get("category", "")
                
                if category:
                    recommendations["favorite_categories"][category] = recommendations["favorite_categories"].get(category, 0) + 3  # Higher weight for clicks
            
            # Recent interests (last 7 days)
            week_ago = datetime.now() - timedelta(days=7)
            recent_views = [
                view for view in profile.get("viewed_products", [])
                if datetime.fromisoformat(view["timestamp"]) > week_ago
            ]
            
            recent_categories = [view.get("data", {}).get("category", "") for view in recent_views]
            recommendations["recent_interests"] = list(set([cat for cat in recent_categories if cat]))
            
            # Search patterns
            searches = profile.get("search_history", [])
            search_queries = [search.get("data", {}).get("query", "") for search in searches[-10:]]
            recommendations["search_patterns"] = [q for q in search_queries if q]
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting user recommendations: {e}")
            return {}
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users (for admin purposes)"""
        try:
            users = []
            for user_id, user_data in self.users_data["users"].items():
                users.append({
                    "user_id": user_id,
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "created_at": user_data["created_at"],
                    "last_login": user_data["last_login"]
                })
            return users
        except Exception as e:
            logger.error(f"Error getting all users: {e}")
            return []
