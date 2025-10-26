from fastapi import APIRouter, Depends, Header
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from services.weaviate_service import WeaviateService
from services.search_service import SearchService
from services.domain_detection_service import DomainDetectionService
from services.user_behavior_service import UserBehaviorService
from services.robust_ranking_service import RobustRankingService, RankingConfig, RankingSignal
import logging
import random

logger = logging.getLogger(__name__)

router = APIRouter()

class UnifiedSearchRequest(BaseModel):
    query: str
    domain: Optional[str] = None
    limit: int = 10
    # Ranking configuration
    ranking_weights: Optional[Dict[str, float]] = None
    retrieval_weights: Optional[Dict[str, float]] = None
    # Ad configuration
    ad_integration: bool = True
    ad_budget: float = 0.2
    user_segment: Optional[str] = None
    # Search algorithm configuration
    search_algorithm: str = "hybrid"  # hybrid, semantic, keyword, visual
    boost_factors: Optional[Dict[str, float]] = None

class UnifiedSearchResponse(BaseModel):
    results: list
    search_metadata: Dict[str, Any]
    ranking_breakdown: Dict[str, Any]
    ad_breakdown: Dict[str, Any]
    algorithm_performance: Dict[str, Any]

# Import ad campaigns from the ad_campaigns module
from api.endpoints.ad_campaigns import AD_CAMPAIGNS, get_relevant_ads, integrate_ads_with_results, calculate_ad_revenue

@router.post("/unified-search", response_model=UnifiedSearchResponse)
async def unified_search_demo(
    request: UnifiedSearchRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Demonstrate how ads, search algorithms, and ranking work together
    """
    try:
        weaviate_service = WeaviateService()
        domain_service = DomainDetectionService()
        behavior_service = UserBehaviorService()
        
        # Detect domain if not provided
        detected_domain = request.domain or domain_service.detect_domain(request.query)
        
        # Create search service with detected domain
        search_service = SearchService(domain=detected_domain)
        
        # Step 1: Execute search algorithm using SearchService
        search_results, algorithm_performance = await execute_search_algorithm(
            search_service, 
            request.query, 
            request.search_algorithm,
            request.limit * 2,  # Get more for ranking and ad integration
            request.retrieval_weights,
            detected_domain
        )
        
        # Step 2: Apply robust ranking algorithm
        ranked_results, ranking_breakdown = apply_robust_ranking(
            search_results,
            request.query,
            request.ranking_weights or {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
            request.boost_factors or {"sale": 0.0, "new": 0.0},
            detected_domain,
            session_id
        )
        
        # Step 3: Integrate ad campaigns with competitive ranking
        if request.ad_integration:
            relevant_ads = get_relevant_ads(request.query, detected_domain, request.user_segment)
            final_results, ad_campaigns = integrate_ads_competitively(
                ranked_results, 
                relevant_ads, 
                request.ad_budget,
                request.limit,
                request.query,
                detected_domain,
                request.ranking_weights or {"relevance": 0.6, "personalization": 0.3, "business_priority": 0.1},
                request.boost_factors or {"sale": 0.0, "new": 0.0}
            )
            ad_revenue = calculate_ad_revenue(ad_campaigns)
        else:
            final_results = ranked_results[:request.limit]
            ad_campaigns = []
            ad_revenue = 0.0
        
        # Step 4: Calculate performance metrics
        search_metadata = {
            "query": request.query,
            "domain": detected_domain,
            "algorithm": request.search_algorithm,
            "total_results": len(final_results),
            "organic_results": len([r for r in final_results if not r.get("is_sponsored", False)]),
            "sponsored_results": len([r for r in final_results if r.get("is_sponsored", False)]),
            "processing_time_ms": algorithm_performance.get("processing_time", 0)
        }
        
        ad_breakdown = {
            "total_ads": len(ad_campaigns),
            "ad_revenue_estimate": ad_revenue,
            "ad_budget_used": request.ad_budget,
            "user_segment": request.user_segment,
            "campaigns": [{"id": ad["id"], "bid": ad["bid_amount"], "ctr": ad["ctr_estimate"]} for ad in ad_campaigns]
        }
        
        # Track search behavior
        if session_id:
            behavior_service.track_search(
                session_id, 
                request.query, 
                len(final_results), 
                detected_domain
            )
        
        return UnifiedSearchResponse(
            results=final_results,
            search_metadata=search_metadata,
            ranking_breakdown=ranking_breakdown,
            ad_breakdown=ad_breakdown,
            algorithm_performance=algorithm_performance
        )
        
    except Exception as e:
        logger.error(f"Error in unified search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def execute_search_algorithm(
    search_service: SearchService,
    query: str,
    algorithm: str,
    limit: int,
    retrieval_weights: Optional[Dict[str, float]] = None,
    domain: str = "clothing"
) -> tuple:
    """Execute the specified search algorithm"""
    import time
    start_time = time.time()
    
    try:
        # Use SearchService for all algorithms
        results = await search_service.hybrid_search(
            query=query,
            query_type="text",
            domain=domain,
            limit=limit
        )
        
        performance = {
            "algorithm": algorithm,
            "retrieval_method": "hybrid_search",
            "processing_time": (time.time() - start_time) * 1000
        }
        
        # Ensure results is a list and not None
        if results is None:
            results = []
        
        logger.info(f"Search algorithm '{algorithm}' returned {len(results)} results for query '{query}'")
        return results, performance
        
    except Exception as e:
        logger.error(f"Error in execute_search_algorithm: {str(e)}")
        return [], {
            "algorithm": algorithm,
            "retrieval_method": "error",
            "processing_time": (time.time() - start_time) * 1000,
            "error": str(e)
        }

def apply_robust_ranking(
    results: List[Dict],
    query: str,
    ranking_weights: Dict[str, float],
    boost_factors: Dict[str, float],
    domain: str,
    session_id: Optional[str] = None
) -> tuple:
    """Apply robust ranking using the new ranking service"""
    
    # Create ranking configuration from request weights
    signal_weights = {
        RankingSignal.RELEVANCE: ranking_weights.get("relevance", 0.4),
        RankingSignal.PERSONALIZATION: ranking_weights.get("personalization", 0.25),
        RankingSignal.BUSINESS_PRIORITY: ranking_weights.get("business_priority", 0.15),
        RankingSignal.DIVERSITY: 0.1,
        RankingSignal.FRESHNESS: 0.05,
        RankingSignal.POPULARITY: 0.03,
        RankingSignal.QUALITY: 0.02
    }
    
    # Normalize weights to sum to 1.0
    total_weight = sum(signal_weights.values())
    signal_weights = {k: v / total_weight for k, v in signal_weights.items()}
    
    config = RankingConfig(
        signal_weights=signal_weights,
        normalize_scores=True,
        diversity_penalty=0.1,
        max_similar_items=3
    )
    
    # Create user context from session
    user_context = None
    if session_id:
        # In production, this would fetch real user data
        user_context = {
            "preferences": {
                "price_range": [20, 200],
                "categories": ["clothing", "accessories"],
                "brands": ["fossil", "vintage", "premium"]
            },
            "history": [],
            "recent_views": []
        }
    
    # Apply boost factors to products
    for result in results:
        title = result.get("title", "").lower()
        for factor, boost in boost_factors.items():
            if factor in title:
                # Add boost as a custom attribute
                result[f"boost_{factor}"] = boost
    
    # Apply improved ranking algorithm
    ranked_results = []
    for i, result in enumerate(results):
        # Start with base relevance score (position-based)
        base_relevance = 0.9 - (i * 0.05)  # More gradual decrease
        
        # Calculate different score components
        title = result.get("title", "").lower()
        description = result.get("description", "").lower()
        price = result.get("price", 0)
        
        # 1. RELEVANCE SCORE (0-1 range)
        relevance_score = base_relevance * ranking_weights.get("relevance", 0.6)
        
        # 2. PERSONALIZATION SCORE (0-1 range)
        personalization_score = 0.0
        if ranking_weights.get("personalization", 0.3) > 0:
            # User segment-based personalization
            if session_id and "premium" in session_id:
                # Premium users prefer premium products
                if price > 100:
                    personalization_score += 0.8  # High score for premium products
                elif price > 50:
                    personalization_score += 0.6  # Medium score for mid-range
                else:
                    personalization_score += 0.3  # Lower score for budget
            elif session_id and "vip" in session_id:
                # VIP users strongly prefer premium products
                if price > 150:
                    personalization_score += 0.9  # Very high score for luxury
                elif price > 100:
                    personalization_score += 0.7  # High score for premium
                elif price > 50:
                    personalization_score += 0.4  # Medium score for mid-range
                else:
                    personalization_score += 0.2  # Low score for budget
            else:
                # Standard users prefer mid-range products
                if 50 <= price <= 200:
                    personalization_score += 0.8  # High score for mid-range
                elif price < 50:
                    personalization_score += 0.6  # Medium score for budget
                else:
                    personalization_score += 0.4  # Lower score for premium
                    
            # Special handling for budget-conscious users (detected by high relevance weight)
            if ranking_weights.get("relevance", 0.6) > 0.5 and ranking_weights.get("personalization", 0.3) > 0.2:
                # Budget-conscious users prefer cheapest products
                if price < 30:
                    personalization_score += 0.4  # Extra boost for very cheap products
                elif price < 50:
                    personalization_score += 0.2  # Boost for cheap products
                
            # Brand-based personalization
            premium_brands = ["nike", "adidas", "apple", "samsung", "ikea", "rihanna"]
            if any(brand in title for brand in premium_brands):
                personalization_score += 0.3
                
            # Category-based personalization for premium users
            if session_id and ("premium" in session_id or "vip" in session_id):
                premium_categories = ["perfume", "handbags", "jewelry", "luxury", "premium"]
                category = result.get("category", "").lower()
                if any(cat in category for cat in premium_categories):
                    personalization_score += 0.2
                
            # Normalize and apply weight
            personalization_score = min(1.0, personalization_score) * ranking_weights.get("personalization", 0.3)
        
        # 3. BUSINESS PRIORITY SCORE (0-1 range)
        business_score = 0.0
        if ranking_weights.get("business_priority", 0.1) > 0:
            # Higher-priced items get business boost
            if price > 100:
                business_score += 0.6
            elif price > 50:
                business_score += 0.4
            else:
                business_score += 0.2
                
            # Items with certain keywords get business boost
            business_keywords = ["new", "sale", "premium", "professional", "best", "luxury"]
            if any(keyword in title for keyword in business_keywords):
                business_score += 0.4
                
            # Category-based business priority
            category = result.get("category", "").lower()
            high_value_categories = ["perfume", "handbags", "jewelry", "electronics"]
            if any(cat in category for cat in high_value_categories):
                business_score += 0.3
                
            # Normalize and apply weight
            business_score = min(1.0, business_score) * ranking_weights.get("business_priority", 0.1)
        
        # 4. BOOST FACTORS (additive)
        boost_score = 0.0
        for factor, boost in boost_factors.items():
            if factor in title:
                boost_score += boost
        
        # 5. CALCULATE FINAL SCORE
        final_score = relevance_score + personalization_score + business_score + boost_score
        final_score = min(1.0, max(0.0, final_score))  # Normalize to 0-1
        
        result["score"] = final_score
        result["ranking_breakdown"] = {
            "relevance": relevance_score,
            "personalization": personalization_score,
            "business_priority": business_score,
            "boost": boost_score,
            "final_score": final_score,
            "base_relevance": base_relevance
        }
        ranked_results.append(result)
    
    # Sort by final score
    ranked_results = sorted(ranked_results, key=lambda x: x.get("score", 0), reverse=True)
    
    # Create ranking breakdown for response
    ranking_breakdown = {
        "weights": ranking_weights,
        "boost_factors": boost_factors,
        "domain": domain,
        "total_results": len(ranked_results),
        "signal_weights": {signal.value: weight for signal, weight in signal_weights.items()},
        "score_distribution": {
            "min_score": min(r.get("score", 0) for r in ranked_results) if ranked_results else 0,
            "max_score": max(r.get("score", 0) for r in ranked_results) if ranked_results else 0,
            "avg_score": sum(r.get("score", 0) for r in ranked_results) / len(ranked_results) if ranked_results else 0
        }
    }
    
    return ranked_results, ranking_breakdown

def integrate_ads_competitively(
    organic_results: List[Dict], 
    ads: List[Dict], 
    ad_budget: float,
    total_limit: int,
    query: str,
    domain: str,
    ranking_weights: Dict[str, float],
    boost_factors: Dict[str, float]
) -> tuple:
    """Integrate ads competitively based on their actual scores"""
    if not ads or ad_budget <= 0:
        return organic_results[:total_limit], []

    # Calculate how many ads to show based on budget
    max_ads = min(len(ads), int(total_limit * ad_budget))
    selected_ads = ads[:max_ads]
    
    # Score each ad competitively using the same ranking algorithm
    scored_ads = []
    for ad in selected_ads:
        # Create a mock result for the ad
        ad_result = {
            "id": ad["id"],
            "title": ad["title"],
            "description": ad["description"],
            "price": ad["price"],
            "category": "advertisement",
            "is_sponsored": True,
            "bid_amount": ad["bid_amount"],
            "ctr_estimate": ad["ctr_estimate"]
        }
        
        # Apply the same ranking algorithm to ads
        title = ad["title"].lower()
        description = ad["description"].lower()
        price = ad["price"]
        
        # Calculate relevance score based on query matching
        query_lower = query.lower()
        relevance_score = 0.0
        
        # Check if ad targets this query
        if any(keyword in query_lower for keyword in ad["target_keywords"]):
            relevance_score = 0.8  # High relevance for targeted ads
        else:
            relevance_score = 0.3  # Lower relevance for non-targeted ads
            
        # Apply ranking weights
        final_relevance = relevance_score * ranking_weights.get("relevance", 0.6)
        
        # Personalization score (ads get moderate personalization)
        personalization_score = 0.2 * ranking_weights.get("personalization", 0.3)
        
        # Business priority score (ads get high business priority)
        business_score = 0.8 * ranking_weights.get("business_priority", 0.1)
        
        # Apply boost factors
        boost_score = 0.0
        for factor, boost in boost_factors.items():
            if factor in title:
                boost_score += boost
        
        # Special handling for sale products
        is_sale_product = any(keyword in title.lower() for keyword in ["sale", "discount", "off", "clearance", "deal"])
        if is_sale_product and boost_factors.get("sale", 0) > 0:
            boost_score += boost_factors["sale"]
        
        # Special handling for new products
        is_new_product = any(keyword in title.lower() for keyword in ["new", "latest", "arrival", "fresh"])
        if is_new_product and boost_factors.get("new", 0) > 0:
            boost_score += boost_factors["new"]
        
        # Bid-based boost (higher bids get higher scores)
        bid_boost = min(0.2, ad["bid_amount"] * 0.05)  # Max 0.2 boost from bid
        
        # Calculate final score
        final_score = final_relevance + personalization_score + business_score + boost_score + bid_boost
        final_score = min(1.0, max(0.0, final_score))
        
        ad_result["score"] = final_score
        ad_result["ranking_breakdown"] = {
            "relevance": final_relevance,
            "personalization": personalization_score,
            "business_priority": business_score,
            "boost": boost_score + bid_boost,
            "final_score": final_score,
            "bid_boost": bid_boost
        }
        
        scored_ads.append(ad_result)
    
    # Combine organic and ad results
    all_results = organic_results + scored_ads
    
    # Sort all results by score (highest first)
    all_results = sorted(all_results, key=lambda x: x.get("score", 0), reverse=True)
    
    # Take top results up to limit
    final_results = all_results[:total_limit]
    
    # Extract ad campaigns that made it to final results
    ad_campaigns = [ad for ad in scored_ads if ad in final_results]
    
    return final_results, ad_campaigns
