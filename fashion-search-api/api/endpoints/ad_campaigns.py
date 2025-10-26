from fastapi import APIRouter, Depends, Header
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from services.weaviate_service import WeaviateService
from services.domain_detection_service import DomainDetectionService
from services.user_behavior_service import UserBehaviorService
import logging
import random

logger = logging.getLogger(__name__)

router = APIRouter()

class AdCampaignRequest(BaseModel):
    query: str
    domain: Optional[str] = None
    limit: int = 10
    ad_integration: bool = True
    ad_budget: float = 0.2  # 20% of results can be ads
    user_segment: Optional[str] = None  # premium, standard, new_user

class AdCampaignResponse(BaseModel):
    results: list
    ad_campaigns: list
    total_ads: int
    total_organic: int
    ad_revenue_estimate: float
    query: str
    domain: str

# Mock ad campaigns database
AD_CAMPAIGNS = {
    "clothing": [
        {
            "id": "ad_clothing_001",
            "title": "🔥 SUMMER SALE: 50% OFF All Dresses!",
            "description": "Limited time offer! Get 50% off on all summer dresses. Free shipping on orders over $50. Don't miss out!",
            "price": 29.99,
            "original_price": 59.99,
            "image_url": "https://via.placeholder.com/300x300/ff6b6b/white?text=SUMMER+SALE",
            "advertiser": "FashionStore Pro",
            "campaign_type": "promotional",
            "target_keywords": ["dress", "women", "fashion", "clothing"],
            "bid_amount": 2.50,
            "ctr_estimate": 0.08,
            "is_sponsored": True,
            "ad_placement": "top"
        },
        {
            "id": "ad_clothing_002", 
            "title": "✨ Premium Women's Handbags - Luxury Collection",
            "description": "Discover our exclusive collection of premium handbags. Handcrafted leather, designer styles. Free personalization available.",
            "price": 199.99,
            "image_url": "https://via.placeholder.com/300x300/667eea/white?text=PREMIUM+BAGS",
            "advertiser": "LuxuryBags Co",
            "campaign_type": "brand_awareness",
            "target_keywords": ["bag", "handbag", "women", "luxury", "premium"],
            "bid_amount": 3.20,
            "ctr_estimate": 0.06,
            "is_sponsored": True,
            "ad_placement": "middle"
        }
    ],
    "electronics": [
        {
            "id": "ad_electronics_001",
            "title": "🎧 NEW: Wireless Noise-Canceling Headphones",
            "description": "Revolutionary sound technology. 30-hour battery life. Now with AI-powered noise cancellation. Order today!",
            "price": 149.99,
            "original_price": 199.99,
            "image_url": "https://via.placeholder.com/300x300/4ecdc4/white?text=WIRELESS+HEADPHONES",
            "advertiser": "SoundTech Pro",
            "campaign_type": "product_launch",
            "target_keywords": ["headphone", "wireless", "audio", "music", "electronics"],
            "bid_amount": 4.00,
            "ctr_estimate": 0.12,
            "is_sponsored": True,
            "ad_placement": "top"
        }
    ],
    "furniture": [
        {
            "id": "ad_furniture_001",
            "title": "🪑 Modern Living Room Set - 40% OFF",
            "description": "Complete your living room with our modern furniture set. Sofa, coffee table, and side tables included. Free assembly!",
            "price": 899.99,
            "original_price": 1499.99,
            "image_url": "https://via.placeholder.com/300x300/45b7d1/white?text=LIVING+ROOM+SET",
            "advertiser": "HomeDecor Plus",
            "campaign_type": "seasonal_sale",
            "target_keywords": ["sofa", "furniture", "living room", "modern", "home"],
            "bid_amount": 5.50,
            "ctr_estimate": 0.07,
            "is_sponsored": True,
            "ad_placement": "top"
        }
    ],
    "groceries": [
        {
            "id": "ad_groceries_001",
            "title": "🥗 Organic Fresh Produce - Farm to Table",
            "description": "100% organic fruits and vegetables delivered fresh daily. Support local farmers. Free delivery on orders over $30.",
            "price": 24.99,
            "image_url": "https://via.placeholder.com/300x300/96ceb4/white?text=ORGANIC+PRODUCE",
            "advertiser": "GreenFarm Organics",
            "campaign_type": "brand_awareness",
            "target_keywords": ["organic", "fresh", "produce", "vegetables", "healthy"],
            "bid_amount": 1.80,
            "ctr_estimate": 0.09,
            "is_sponsored": True,
            "ad_placement": "middle"
        }
    ]
}

@router.post("/ad-integration", response_model=AdCampaignResponse)
async def search_with_ad_integration(
    request: AdCampaignRequest,
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
):
    """
    Demonstrate ad campaign integration in search results
    """
    try:
        weaviate_service = WeaviateService()
        domain_service = DomainDetectionService()
        behavior_service = UserBehaviorService()
        
        # Detect domain if not provided
        detected_domain = request.domain or domain_service.detect_domain(request.query)
        
        # Get organic search results
        organic_results = await weaviate_service.search_by_text(
            query=request.query,
            limit=request.limit * 2  # Get more to account for ad insertion
        )
        
        # Get relevant ad campaigns for this domain and query
        relevant_ads = get_relevant_ads(request.query, detected_domain, request.user_segment)
        
        # Integrate ads with organic results
        integrated_results, ad_campaigns = integrate_ads_with_results(
            organic_results, 
            relevant_ads, 
            request.ad_budget,
            request.limit
        )
        
        # Calculate ad revenue estimate
        ad_revenue = calculate_ad_revenue(ad_campaigns)
        
        # Track search behavior
        if session_id:
            behavior_service.track_search(
                session_id, 
                request.query, 
                len(integrated_results), 
                detected_domain
            )
        
        return AdCampaignResponse(
            results=integrated_results,
            ad_campaigns=ad_campaigns,
            total_ads=len(ad_campaigns),
            total_organic=len(integrated_results) - len(ad_campaigns),
            ad_revenue_estimate=ad_revenue,
            query=request.query,
            domain=detected_domain
        )
        
    except Exception as e:
        logger.error(f"Error in ad integration search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def get_relevant_ads(query: str, domain: str, user_segment: Optional[str]) -> List[Dict]:
    """Get relevant ad campaigns based on query and domain"""
    domain_ads = AD_CAMPAIGNS.get(domain, [])
    query_lower = query.lower()
    
    relevant_ads = []
    for ad in domain_ads:
        # Check if ad targets this query
        if any(keyword in query_lower for keyword in ad["target_keywords"]):
            # Adjust bid based on user segment
            adjusted_ad = ad.copy()
            if user_segment == "premium":
                adjusted_ad["bid_amount"] *= 1.5  # Higher bids for premium users
            elif user_segment == "new_user":
                adjusted_ad["bid_amount"] *= 1.2  # Slightly higher for new users
            relevant_ads.append(adjusted_ad)
    
    # Sort by bid amount (highest first)
    return sorted(relevant_ads, key=lambda x: x["bid_amount"], reverse=True)

def integrate_ads_with_results(
    organic_results: List[Dict], 
    ads: List[Dict], 
    ad_budget: float,
    total_limit: int
) -> tuple:
    """Integrate ads into organic search results"""
    if not ads:
        return organic_results[:total_limit], []
    
    # Calculate how many ads to show based on budget
    max_ads = min(len(ads), int(total_limit * ad_budget))
    selected_ads = ads[:max_ads]
    
    # Create integrated results
    integrated = []
    ad_campaigns = []
    
    # Add top ad if available
    if selected_ads and selected_ads[0]["ad_placement"] == "top":
        top_ad = selected_ads[0]
        integrated.append(create_ad_result(top_ad, 0))
        ad_campaigns.append(top_ad)
        selected_ads = selected_ads[1:]
    
    # Add organic results with middle ads
    organic_index = 0
    for i in range(total_limit - len(ad_campaigns)):
        # Add organic result
        if organic_index < len(organic_results):
            integrated.append(organic_results[organic_index])
            organic_index += 1
        
        # Add middle ad after every 2-3 organic results
        if (i + 1) % 3 == 0 and selected_ads:
            middle_ad = selected_ads[0]
            integrated.append(create_ad_result(middle_ad, len(integrated)))
            ad_campaigns.append(middle_ad)
            selected_ads = selected_ads[1:]
    
    return integrated, ad_campaigns

def create_ad_result(ad: Dict, position: int) -> Dict:
    """Convert ad campaign to search result format"""
    return {
        "id": ad["id"],
        "title": ad["title"],
        "description": ad["description"],
        "price": ad["price"],
        "original_price": ad.get("original_price"),
        "image_url": ad["image_url"],
        "score": 0.95,  # High score for ads
        "domain": "advertisement",
        "is_sponsored": True,
        "advertiser": ad["advertiser"],
        "campaign_type": ad["campaign_type"],
        "bid_amount": ad["bid_amount"],
        "ctr_estimate": ad["ctr_estimate"],
        "ad_placement": ad["ad_placement"],
        "position": position,
        "ad_breakdown": {
            "bid_amount": ad["bid_amount"],
            "estimated_clicks": ad["ctr_estimate"] * 1000,  # Assume 1000 impressions
            "revenue_per_click": ad["bid_amount"],
            "total_revenue": ad["bid_amount"] * ad["ctr_estimate"] * 1000
        }
    }

def calculate_ad_revenue(ad_campaigns: List[Dict]) -> float:
    """Calculate estimated ad revenue"""
    total_revenue = 0.0
    for ad in ad_campaigns:
        if "ad_breakdown" in ad:
            total_revenue += ad["ad_breakdown"]["total_revenue"]
    return total_revenue
