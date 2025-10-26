import logging
from typing import List, Dict, Any, Optional
from services.user_behavior_service import UserBehaviorService
from services.user_service import UserService
from services.weaviate_service import WeaviateService

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.user_behavior_service = UserBehaviorService()
        self.user_service = UserService()
        self.weaviate_service = WeaviateService()
    
    async def get_user_recommendations(self, user_id: str, limit: int = 20) -> Dict[str, Any]:
        """Get personalized product recommendations for a logged-in user"""
        try:
            # Get all products from Weaviate
            all_products = await self.weaviate_service.get_all_products(limit=1000)
            
            if not all_products:
                return {
                    "recommendations": [],
                    "sections": [],
                    "user_type": "new"
                }
            
            # Get user data and preferences
            user_data = self.user_service.get_user_by_id(user_id)
            if not user_data:
                return {
                    "recommendations": [],
                    "sections": [],
                    "user_type": "new"
                }
            
            user_recommendations = self.user_service.get_user_recommendations(user_id)
            
            # Create recommendation sections
            sections = []
            
            # 1. Personalized recommendations based on user behavior
            personalized_products = self._get_user_recommendation_candidates(user_recommendations, all_products)
            if personalized_products:
                sections.append({
                    "title": "Recommended for You",
                    "subtitle": f"Based on your preferences, {user_data['name']}",
                    "products": personalized_products[:8],
                    "type": "personalized"
                })
            
            # 2. Trending products
            trending_products = await self._get_trending_products(all_products)
            if trending_products:
                sections.append({
                    "title": "Trending Now",
                    "subtitle": "Popular items this week",
                    "products": trending_products[:8],
                    "type": "trending"
                })
            
            # 3. Category-based recommendations
            favorite_categories = list(user_recommendations.get("favorite_categories", {}).keys())
            if favorite_categories:
                for category in favorite_categories[:2]:
                    category_products = [p for p in all_products if p.get("category", "").lower() == category.lower()]
                    if category_products:
                        sections.append({
                            "title": f"More {category}",
                            "subtitle": f"Explore our {category.lower()} collection",
                            "products": category_products[:8],
                            "type": "category"
                        })
            
            # 4. Price-based recommendations
            price_range = user_recommendations.get("price_range", {"min": 0, "max": 1000})
            if price_range["min"] > 0 or price_range["max"] < 1000:
                price_products = [
                    p for p in all_products 
                    if price_range["min"] <= p.get("price", 0) <= price_range["max"]
                ]
                if price_products:
                    sections.append({
                        "title": "In Your Price Range",
                        "subtitle": f"${price_range['min']:.0f} - ${price_range['max']:.0f}",
                        "products": price_products[:8],
                        "type": "price"
                    })
            
            # 5. Recent interests
            recent_interests = user_recommendations.get("recent_interests", [])
            if recent_interests:
                recent_products = []
                for interest in recent_interests:
                    interest_products = [p for p in all_products if p.get("category", "").lower() == interest.lower()]
                    recent_products.extend(interest_products[:4])
                
                if recent_products:
                    sections.append({
                        "title": "Based on Recent Activity",
                        "subtitle": "Items you've been interested in",
                        "products": recent_products[:8],
                        "type": "recent"
                    })
            
            # 6. New arrivals (fallback)
            if len(sections) < 3:
                new_products = all_products[:8]
                sections.append({
                    "title": "New Arrivals",
                    "subtitle": "Fresh picks just for you",
                    "products": new_products,
                    "type": "new"
                })
            
            return {
                "recommendations": personalized_products[:limit],
                "sections": sections,
                "user_type": "returning",
                "user_name": user_data["name"],
                "total_products": len(all_products)
            }
            
        except Exception as e:
            logger.error(f"Error getting user recommendations: {e}")
            return {
                "recommendations": [],
                "sections": [],
                "user_type": "new",
                "error": str(e)
            }
    
    async def get_personalized_recommendations(self, session_id: str, limit: int = 20) -> Dict[str, Any]:
        """Get personalized product recommendations for a user"""
        try:
            # Get all products from Weaviate
            all_products = await self.weaviate_service.get_all_products(limit=1000)
            
            if not all_products:
                return {
                    "recommendations": [],
                    "sections": [],
                    "user_type": "new"
                }
            
            # Get user preferences
            user_preferences = self.user_behavior_service.get_user_preferences(session_id)
            user_stats = self.user_behavior_service.get_user_stats(session_id)
            
            # Create recommendation sections
            sections = []
            
            # 1. Personalized recommendations based on behavior
            personalized_products = self.user_behavior_service.get_recommendation_candidates(session_id, all_products)
            if personalized_products:
                sections.append({
                    "title": "Recommended for You",
                    "subtitle": "Based on your browsing history",
                    "products": personalized_products[:8],
                    "type": "personalized"
                })
            
            # 2. Trending products (most viewed recently)
            trending_products = await self._get_trending_products(all_products)
            if trending_products:
                sections.append({
                    "title": "Trending Now",
                    "subtitle": "Popular items this week",
                    "products": trending_products[:8],
                    "type": "trending"
                })
            
            # 3. Category-based recommendations
            favorite_categories = list(user_preferences.get("favorite_categories", {}).keys())
            if favorite_categories:
                for category in favorite_categories[:2]:  # Top 2 categories
                    category_products = [p for p in all_products if p.get("category", "").lower() == category.lower()]
                    if category_products:
                        sections.append({
                            "title": f"More {category}",
                            "subtitle": f"Explore our {category.lower()} collection",
                            "products": category_products[:8],
                            "type": "category"
                        })
            
            # 4. Price-based recommendations
            price_range = user_preferences.get("price_range", {"min": 0, "max": 1000})
            if price_range["min"] > 0 or price_range["max"] < 1000:
                price_products = [
                    p for p in all_products 
                    if price_range["min"] <= p.get("price", 0) <= price_range["max"]
                ]
                if price_products:
                    sections.append({
                        "title": "In Your Price Range",
                        "subtitle": f"${price_range['min']:.0f} - ${price_range['max']:.0f}",
                        "products": price_products[:8],
                        "type": "price"
                    })
            
            # 5. New arrivals (for new users or as fallback)
            if user_stats.get("user_type") == "new" or len(sections) < 3:
                new_products = all_products[:8]  # First 8 products as "new"
                sections.append({
                    "title": "New Arrivals",
                    "subtitle": "Fresh picks just for you",
                    "products": new_products,
                    "type": "new"
                })
            
            # 6. Similar to what you liked
            recent_clicks = self.user_behavior_service.behavior_data.get(session_id, {}).get("clicks", [])
            if recent_clicks:
                similar_products = await self._get_similar_products(recent_clicks[-1], all_products)
                if similar_products:
                    sections.append({
                        "title": "Similar to What You Liked",
                        "subtitle": "You might also enjoy",
                        "products": similar_products[:8],
                        "type": "similar"
                    })
            
            return {
                "recommendations": personalized_products[:limit],
                "sections": sections,
                "user_type": user_stats.get("user_type", "new"),
                "total_products": len(all_products)
            }
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return {
                "recommendations": [],
                "sections": [],
                "user_type": "new",
                "error": str(e)
            }
    
    async def _get_trending_products(self, all_products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Get trending products based on recent views across all users"""
        try:
            # This is a simplified trending algorithm
            # In a real system, you'd analyze view patterns across all users
            
            # For now, return products with higher prices (as a proxy for popularity)
            trending = sorted(all_products, key=lambda x: x.get("price", 0), reverse=True)
            return trending[:20]
        except Exception as e:
            logger.error(f"Error getting trending products: {e}")
            return []
    
    async def _get_similar_products(self, liked_product: Dict[str, Any], all_products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Get products similar to a liked product"""
        try:
            liked_category = liked_product.get("category", "")
            liked_price = liked_product.get("price", 0)
            
            # Find products in same category with similar price range
            similar = []
            for product in all_products:
                if product.get("product_id") == liked_product.get("product_id"):
                    continue
                
                product_category = product.get("category", "")
                product_price = product.get("price", 0)
                
                # Same category and similar price (±20%)
                if (product_category.lower() == liked_category.lower() and 
                    abs(product_price - liked_price) / max(liked_price, 1) <= 0.2):
                    similar.append(product)
            
            return similar[:10]
        except Exception as e:
            logger.error(f"Error getting similar products: {e}")
            return []
    
    async def get_search_suggestions(self, session_id: str, query: str) -> List[str]:
        """Get search suggestions based on user history and popular searches"""
        try:
            user_data = self.user_behavior_service.behavior_data.get(session_id, {})
            user_searches = [search.get("query", "") for search in user_data.get("searches", [])]
            
            suggestions = []
            
            # Add user's recent searches that match the query
            for search in user_searches:
                if query.lower() in search.lower() and search not in suggestions:
                    suggestions.append(search)
            
            # Add popular search terms (simplified)
            popular_terms = [
                "red dress", "blue jeans", "black shoes", "white shirt",
                "summer dress", "winter jacket", "casual wear", "formal wear",
                "gaming laptop", "wireless headphones", "smartphone", "tablet"
            ]
            
            for term in popular_terms:
                if query.lower() in term.lower() and term not in suggestions:
                    suggestions.append(term)
            
            return suggestions[:5]
            
        except Exception as e:
            logger.error(f"Error getting search suggestions: {e}")
            return []
    
    def _get_user_recommendation_candidates(self, user_recommendations: Dict[str, Any], all_products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Get products that match user preferences for recommendations"""
        if not user_recommendations.get("favorite_categories") and not user_recommendations.get("recent_interests"):
            # New user - return popular products
            return all_products[:20]
        
        scored_products = []
        
        for product in all_products:
            score = 0
            product_category = product.get("category", "")
            product_price = product.get("price", 0)
            
            # Category preference scoring
            if product_category in user_recommendations.get("favorite_categories", {}):
                score += user_recommendations["favorite_categories"][product_category] * 10
            
            # Recent interests scoring
            if product_category in user_recommendations.get("recent_interests", []):
                score += 5
            
            # Price range scoring
            price_range = user_recommendations.get("price_range", {"min": 0, "max": 1000})
            if price_range["min"] <= product_price <= price_range["max"]:
                score += 2
            
            if score > 0:
                scored_products.append((product, score))
        
        # Sort by score and return top recommendations
        scored_products.sort(key=lambda x: x[1], reverse=True)
        return [product for product, score in scored_products[:20]]
