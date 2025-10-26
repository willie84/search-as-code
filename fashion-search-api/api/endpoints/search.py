from fastapi import APIRouter, HTTPException, UploadFile, File, Header, Depends
from pydantic import BaseModel
from typing import List, Union, Optional
from services.search_service import SearchService
from services.domain_config_service import DomainConfigService
from services.domain_detection_service import DomainDetectionService
from services.user_behavior_service import UserBehaviorService
from api.endpoints.auth import get_current_user

router = APIRouter()
domain_config_service = DomainConfigService()
domain_detection_service = DomainDetectionService()

class SearchRequest(BaseModel):
    query: str = None
    image: UploadFile = None
    filters: Optional[dict] = None
    page: int = 1
    limit: int = 12

class SearchResponse(BaseModel):
    id: str
    title: str
    description: str
    price: float
    image_url: str
    score: float
    domain: str
    search_behavior: dict

@router.post("/search", response_model=List[SearchResponse])
async def search(
    request: SearchRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    current_user: dict = Depends(get_current_user)
):
    if not request.query and not request.image:
        raise HTTPException(status_code=400, detail="Either query or image must be provided.")

    # Auto-detect domain from query
    detected_domain = domain_detection_service.detect_domain(request.query or "")
    
    # Get domain-specific configuration
    domain_config = domain_config_service.get_domain_config(detected_domain)
    if not domain_config:
        # Fallback to clothing if detected domain is not configured
        detected_domain = "clothing"
        domain_config = domain_config_service.get_domain_config(detected_domain)

    # Create search service with detected domain
    search_service = SearchService(domain=detected_domain)
    results = await search_service.hybrid_search(
        query=request.query or "",
        query_type="image" if request.image else "text",
        image=request.image,
        domain=detected_domain,
        limit=request.limit * 2  # Get more results for filtering
    )

    # Get search behavior for this domain
    search_behavior = domain_config_service.get_search_behavior(detected_domain)

    # Track search behavior if session_id is provided
    if session_id and request.query:
        behavior_service = UserBehaviorService()
        behavior_service.track_search(session_id, request.query, len(results), detected_domain)

    # Convert to response format
    response_results = []
    for result in results:
        response_results.append(SearchResponse(
            id=result.get("product_id", ""),
            title=result.get("title", ""),
            description=result.get("description", ""),
            price=result.get("price", 0),
            image_url=result.get("image_url", ""),
            score=result.get("final_score", 0),
            domain=detected_domain,
            search_behavior=search_behavior
        ))

    return response_results

@router.get("/domains/{domain}/config")
async def get_domain_config(domain: str):
    """Get configuration for a specific domain"""
    config = domain_config_service.get_domain_config(domain)
    if not config:
        raise HTTPException(status_code=404, detail=f"Domain {domain} not found")
    
    return {
        "domain": domain,
        "config": config,
        "retrieval_weights": domain_config_service.get_retrieval_weights(domain),
        "ranking_config": domain_config_service.get_ranking_config(domain),
        "search_behavior": domain_config_service.get_search_behavior(domain)
    }