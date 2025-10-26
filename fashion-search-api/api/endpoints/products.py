from fastapi import APIRouter, Depends, Query, Header
from typing import Optional, List
from services.weaviate_service import WeaviateService
from services.auth_service import AuthService
from api.endpoints.auth import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/products")
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search query to filter products"),
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Get all products with pagination and optional search filtering
    """
    try:
        weaviate_service = WeaviateService()
        
        # If search query is provided, use search API
        if search and search.strip():
            from services.search_service import SearchService
            from services.domain_detection_service import DomainDetectionService
            from services.user_behavior_service import UserBehaviorService
            
            search_service = SearchService()
            domain_service = DomainDetectionService()
            behavior_service = UserBehaviorService()
            
            # Detect domain and perform search
            detected_domain = domain_service.detect_domain(search.strip())
            results = await search_service.hybrid_search(
                query=search.strip(),
                domain=detected_domain,
                limit=limit * 2  # Get more results for potential filtering
            )
            
            # Track search behavior
            if session_id:
                behavior_service.track_search(session_id, search.strip(), len(results), detected_domain)
            
            # Apply pagination to search results
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            paginated_results = results[start_idx:end_idx]
            
            return {
                "products": paginated_results,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": len(results),
                    "total_pages": (len(results) + limit - 1) // limit,
                    "has_next": end_idx < len(results),
                    "has_prev": page > 1
                },
                "search_query": search.strip(),
                "domain": detected_domain
            }
        else:
            # Get all products without search
            all_products = await weaviate_service.get_all_products()
            
            # Apply pagination
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            paginated_products = all_products[start_idx:end_idx]
            
            return {
                "products": paginated_products,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": len(all_products),
                    "total_pages": (len(all_products) + limit - 1) // limit,
                    "has_next": end_idx < len(all_products),
                    "has_prev": page > 1
                },
                "search_query": None,
                "domain": None
            }
            
    except Exception as e:
        logger.error(f"Error getting products: {str(e)}")
        return {
            "products": [],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": 0,
                "total_pages": 0,
                "has_next": False,
                "has_prev": False
            },
            "search_query": search,
            "domain": None,
            "error": str(e)
        }
