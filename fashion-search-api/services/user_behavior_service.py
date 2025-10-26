import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class UserBehaviorService:
    def __init__(self):
        self.data_file = "data/user_behavior.json"
        self.behavior_data = self._load_behavior_data()
    
    def _load_behavior_data(self) -> Dict[str, Any]:
        """Load user behavior data from file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading behavior data: {e}")
        return {}
    
    def _save_behavior_data(self):
        """Save user behavior data to file"""
        try:
            os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
            with open(self.data_file, 'w') as f:
                json.dump(self.behavior_data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving behavior data: {e}")
    
    def track_view(self, session_id: str, product_id: str, product_data: Dict[str, Any]):
        """Track when a user views a product"""
        if session_id not in self.behavior_data:
            self.behavior_data[session_id] = {
                "views": [],
                "clicks": [],
                "searches": [],
                "preferences": {},
                "created_at": datetime.now().isoformat()
            }
        
        view_event = {
            "product_id": product_id,
            "timestamp": datetime.now().isoformat(),
            "category": product_data.get("category", ""),
            "price": product_data.get("price", 0),
            "title": product_data.get("title", "")
        }
        
        self.behavior_data[session_id]["views"].append(view_event)
        
        # Keep only last 100 views to prevent data bloat
        if len(self.behavior_data[session_id]["views"]) > 100:
            self.behavior_data[session_id]["views"] = self.behavior_data[session_id]["views"][-100:]
        
        self._save_behavior_data()
        logger.info(f"Tracked view for session {session_id}, product {product_id}")
    
    def track_click(self, session_id: str, product_id: str, product_data: Dict[str, Any]):
        """Track when a user clicks on a product"""
        if session_id not in self.behavior_data:
            self.behavior_data[session_id] = {
                "views": [],
                "clicks": [],
                "searches": [],
                "preferences": {},
                "created_at": datetime.now().isoformat()
            }
        
        click_event = {
            "product_id": product_id,
            "timestamp": datetime.now().isoformat(),
            "category": product_data.get("category", ""),
            "price": product_data.get("price", 0),
            "title": product_data.get("title", "")
        }
        
        self.behavior_data[session_id]["clicks"].append(click_event)
        
        # Keep only last 50 clicks
        if len(self.behavior_data[session_id]["clicks"]) > 50:
            self.behavior_data[session_id]["clicks"] = self.behavior_data[session_id]["clicks"][-50:]
        
        self._save_behavior_data()
        logger.info(f"Tracked click for session {session_id}, product {product_id}")
    
    def track_search(self, session_id: str, query: str, results_count: int, domain: str):
        """Track user search behavior"""
        if session_id not in self.behavior_data:
            self.behavior_data[session_id] = {
                "views": [],
                "clicks": [],
                "searches": [],
                "preferences": {},
                "created_at": datetime.now().isoformat()
            }
        
        search_event = {
            "query": query,
            "timestamp": datetime.now().isoformat(),
            "results_count": results_count,
            "domain": domain
        }
        
        self.behavior_data[session_id]["searches"].append(search_event)
        
        # Keep only last 30 searches
        if len(self.behavior_data[session_id]["searches"]) > 30:
            self.behavior_data[session_id]["searches"] = self.behavior_data[session_id]["searches"][-30:]
        
        self._save_behavior_data()
        logger.info(f"Tracked search for session {session_id}: {query}")
    
    def get_user_preferences(self, session_id: str) -> Dict[str, Any]:
        """Get user preferences based on behavior"""
        if session_id not in self.behavior_data:
            return {}
        
        user_data = self.behavior_data[session_id]
        preferences = {
            "favorite_categories": {},
            "price_range": {"min": 0, "max": 1000},
            "favorite_brands": {},
            "search_patterns": [],
            "recent_interests": []
        }
        
        # Analyze views and clicks to determine preferences
        all_interactions = user_data.get("views", []) + user_data.get("clicks", [])
        
        # Category preferences
        for interaction in all_interactions:
            category = interaction.get("category", "")
            if category:
                preferences["favorite_categories"][category] = preferences["favorite_categories"].get(category, 0) + 1
        
        # Price range analysis
        prices = [interaction.get("price", 0) for interaction in all_interactions if interaction.get("price", 0) > 0]
        if prices:
            preferences["price_range"]["min"] = min(prices)
            preferences["price_range"]["max"] = max(prices)
        
        # Recent interests (last 7 days)
        week_ago = datetime.now() - timedelta(days=7)
        recent_interactions = [
            interaction for interaction in all_interactions
            if datetime.fromisoformat(interaction["timestamp"]) > week_ago
        ]
        
        recent_categories = [interaction.get("category", "") for interaction in recent_interactions]
        preferences["recent_interests"] = list(set(recent_categories))
        
        # Search patterns
        searches = user_data.get("searches", [])
        search_queries = [search.get("query", "") for search in searches[-10:]]  # Last 10 searches
        preferences["search_patterns"] = search_queries
        
        return preferences
    
    def get_recommendation_candidates(self, session_id: str, all_products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Get products that match user preferences for recommendations"""
        preferences = self.get_user_preferences(session_id)
        
        if not preferences.get("favorite_categories") and not preferences.get("recent_interests"):
            # New user - return popular products
            return all_products[:20]
        
        scored_products = []
        
        for product in all_products:
            score = 0
            product_category = product.get("category", "")
            product_price = product.get("price", 0)
            
            # Category preference scoring
            if product_category in preferences.get("favorite_categories", {}):
                score += preferences["favorite_categories"][product_category] * 10
            
            # Recent interests scoring
            if product_category in preferences.get("recent_interests", []):
                score += 5
            
            # Price range scoring
            price_range = preferences.get("price_range", {"min": 0, "max": 1000})
            if price_range["min"] <= product_price <= price_range["max"]:
                score += 2
            
            # Brand preference scoring (if we had brand data)
            # if product.get("brand") in preferences.get("favorite_brands", {}):
            #     score += 3
            
            if score > 0:
                scored_products.append((product, score))
        
        # Sort by score and return top recommendations
        scored_products.sort(key=lambda x: x[1], reverse=True)
        return [product for product, score in scored_products[:20]]
    
    def get_user_stats(self, session_id: str) -> Dict[str, Any]:
        """Get user statistics for analytics"""
        if session_id not in self.behavior_data:
            return {"status": "new_user"}
        
        user_data = self.behavior_data[session_id]
        return {
            "total_views": len(user_data.get("views", [])),
            "total_clicks": len(user_data.get("clicks", [])),
            "total_searches": len(user_data.get("searches", [])),
            "favorite_categories": list(self.get_user_preferences(session_id).get("favorite_categories", {}).keys()),
            "user_type": "returning" if len(user_data.get("views", [])) > 5 else "new"
        }
