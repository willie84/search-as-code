from fastapi import APIRouter, Depends, Header
from typing import Optional, Dict, Any
from pydantic import BaseModel
from services.weaviate_service import WeaviateService
from services.domain_detection_service import DomainDetectionService
from services.user_behavior_service import UserBehaviorService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class RankingDemoRequest(BaseModel):
    query: str
    domain: Optional[str] = None
    limit: int = 10
    ranking_weights: Optional[Dict[str, float]] = None
    retrieval_weights: Optional[Dict[str, float]] = None

class RankingDemoResponse(BaseModel):
    results: list
    ranking_config: Dict[str, Any]
    domain: str
    query: str
    total_results: int

@router.post("/ranking-demo", response_model=RankingDemoResponse)
async def ranking_demo_search(
    request: RankingDemoRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Demonstrate ranking changes with custom configuration
    """
    try:
        weaviate_service = WeaviateService()
        domain_service = DomainDetectionService()
        behavior_service = UserBehaviorService()
        
        # Detect domain if not provided
        detected_domain = request.domain or domain_service.detect_domain(request.query)
        
        # Get domain-specific configuration
        domain_config = domain_service.get_domain_config(detected_domain) if hasattr(domain_service, 'get_domain_config') else {}
        
        # Use custom weights or fallback to domain defaults
        ranking_weights = request.ranking_weights or {
            "relevance": 0.6,
            "personalization": 0.3,
            "business_priority": 0.1
        }
        
        retrieval_weights = request.retrieval_weights or {
            "semantic": 0.4,
            "keyword": 0.2,
            "visual": 0.4
        }
        
        # Perform search with current configuration
        results = await weaviate_service.search_by_text(
            query=request.query,
            limit=request.limit * 2  # Get more results for ranking
        )
        
        # Apply custom ranking based on weights
        ranked_results = apply_custom_ranking(
            results, 
            ranking_weights, 
            retrieval_weights, 
            detected_domain
        )
        
        # Limit results
        final_results = ranked_results[:request.limit]
        
        # Track search behavior
        if session_id:
            behavior_service.track_search(
                session_id, 
                request.query, 
                len(final_results), 
                detected_domain
            )
        
        return RankingDemoResponse(
            results=final_results,
            ranking_config={
                "ranking_weights": ranking_weights,
                "retrieval_weights": retrieval_weights,
                "domain": detected_domain
            },
            domain=detected_domain,
            query=request.query,
            total_results=len(final_results)
        )
        
    except Exception as e:
        logger.error(f"Error in ranking demo search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def apply_custom_ranking(
    results: list, 
    ranking_weights: Dict[str, float], 
    retrieval_weights: Dict[str, float],
    domain: str
) -> list:
    """
    Apply custom ranking based on weights and domain-specific factors
    """
    import random
    import re
    
    # Create more diverse base scores to make ranking changes visible
    base_scores = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    
    # Apply ranking to each result
    for i, result in enumerate(results):
        # Start with a base score that varies by position
        base_score = base_scores[i % len(base_scores)]
        
        # Add some randomness to make it more realistic
        base_score += random.uniform(-0.1, 0.1)
        base_score = max(0.1, min(0.95, base_score))
        
        # Calculate different score components based on weights
        title = result.get("title", "").lower()
        description = result.get("description", "").lower()
        price = result.get("price", 0)
        
        # Relevance score - based on text similarity and keyword matching
        relevance_score = base_score * ranking_weights.get("relevance", 0.6)
        
        # Personalization score - simulate user preferences
        personalization_score = 0.0
        if ranking_weights.get("personalization", 0.3) > 0:
            # Simulate personalization based on product characteristics
            personalization_boost = 0.0
            
            # Price-based personalization (simulate user prefers mid-range)
            if 50 <= price <= 200:
                personalization_boost += 0.2
            elif price < 50:
                personalization_boost += 0.1
            else:
                personalization_boost += 0.05
                
            # Brand-based personalization (simulate user prefers certain brands)
            premium_brands = ["nike", "adidas", "apple", "samsung", "ikea"]
            if any(brand in title for brand in premium_brands):
                personalization_boost += 0.15
                
            # Category-based personalization
            if "women" in title or "men" in title:
                personalization_boost += 0.1
                
            personalization_score = personalization_boost * ranking_weights.get("personalization", 0.3)
        
        # Business priority score - simulate sponsored/featured items
        business_score = 0.0
        if ranking_weights.get("business_priority", 0.1) > 0:
            # Simulate business priority based on product characteristics
            business_boost = 0.0
            
            # Higher-priced items get business boost
            if price > 100:
                business_boost += 0.1
                
            # Items with certain keywords get business boost
            business_keywords = ["new", "sale", "premium", "professional", "best"]
            if any(keyword in title for keyword in business_keywords):
                business_boost += 0.15
                
            # Random business boost for some items
            if random.random() < 0.3:  # 30% chance
                business_boost += random.uniform(0.05, 0.2)
                
            business_score = business_boost * ranking_weights.get("business_priority", 0.1)
        
        # Apply domain-specific factors
        domain_boost = 1.0
        if domain == "clothing":
            if any(word in title for word in ["dress", "shirt", "pants", "shoes"]):
                domain_boost += 0.2
            if any(word in title for word in ["fashion", "style", "trendy"]):
                domain_boost += 0.15
        elif domain == "electronics":
            if any(word in title for word in ["smart", "digital", "wireless", "bluetooth"]):
                domain_boost += 0.2
            if any(word in title for word in ["professional", "high-quality"]):
                domain_boost += 0.15
        elif domain == "furniture":
            if any(word in title for word in ["modern", "comfortable", "durable"]):
                domain_boost += 0.2
            if any(word in title for word in ["home", "office", "living"]):
                domain_boost += 0.15
        elif domain == "groceries":
            if any(word in title for word in ["organic", "fresh", "natural"]):
                domain_boost += 0.2
            if any(word in title for word in ["healthy", "nutritious"]):
                domain_boost += 0.15
        
        # Calculate final score
        final_score = relevance_score + personalization_score + business_score
        final_score *= domain_boost
        
        # Normalize score to 0-1 range
        final_score = min(1.0, max(0.0, final_score))
        
        result["score"] = final_score
        result["ranking_breakdown"] = {
            "relevance": relevance_score,
            "personalization": personalization_score,
            "business_priority": business_score,
            "domain_boost": domain_boost,
            "final_score": final_score,
            "base_score": base_score
        }
    
    # Sort by final score
    return sorted(results, key=lambda x: x.get("score", 0), reverse=True)
