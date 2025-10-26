from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, Dict, Any
import logging
from services.recommendation_service import RecommendationService
from services.user_behavior_service import UserBehaviorService
from api.endpoints.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/recommendations")
async def get_recommendations(
    limit: int = 20,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get personalized product recommendations"""
    try:
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        recommendation_service = RecommendationService()
        recommendations = await recommendation_service.get_personalized_recommendations(session_id, limit)
        
        return {
            "success": True,
            "data": recommendations
        }
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/track/view")
async def track_product_view(
    product_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Track when a user views a product"""
    try:
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        # Get product data from Weaviate
        weaviate_service = RecommendationService().weaviate_service
        products = await weaviate_service.get_all_products(limit=1000)
        product_data = next((p for p in products if p.get("product_id") == product_id), None)
        
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Track the view
        behavior_service = UserBehaviorService()
        behavior_service.track_view(session_id, product_id, product_data)
        
        return {"success": True, "message": "View tracked"}
        
    except Exception as e:
        logger.error(f"Error tracking view: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/track/click")
async def track_product_click(
    product_id: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Track when a user clicks on a product"""
    try:
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        # Get product data from Weaviate
        weaviate_service = RecommendationService().weaviate_service
        products = await weaviate_service.get_all_products(limit=1000)
        product_data = next((p for p in products if p.get("product_id") == product_id), None)
        
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Track the click
        behavior_service = UserBehaviorService()
        behavior_service.track_click(session_id, product_id, product_data)
        
        return {"success": True, "message": "Click tracked"}
        
    except Exception as e:
        logger.error(f"Error tracking click: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suggestions")
async def get_search_suggestions(
    query: str,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get search suggestions based on user history"""
    try:
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        recommendation_service = RecommendationService()
        suggestions = await recommendation_service.get_search_suggestions(session_id, query)
        
        return {
            "success": True,
            "suggestions": suggestions
        }
        
    except Exception as e:
        logger.error(f"Error getting suggestions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user-stats")
async def get_user_stats(
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get user statistics and preferences"""
    try:
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        behavior_service = UserBehaviorService()
        stats = behavior_service.get_user_stats(session_id)
        preferences = behavior_service.get_user_preferences(session_id)
        
        return {
            "success": True,
            "stats": stats,
            "preferences": preferences
        }
        
    except Exception as e:
        logger.error(f"Error getting user stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
