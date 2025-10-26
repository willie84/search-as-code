from typing import List, Dict, Any, Optional, Tuple
import logging
import math
import statistics
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class RankingSignal(Enum):
    """Types of ranking signals"""
    RELEVANCE = "relevance"
    PERSONALIZATION = "personalization"
    BUSINESS_PRIORITY = "business_priority"
    DIVERSITY = "diversity"
    FRESHNESS = "freshness"
    POPULARITY = "popularity"
    QUALITY = "quality"

@dataclass
class RankingConfig:
    """Configuration for ranking algorithm"""
    # Signal weights (must sum to 1.0)
    signal_weights: Dict[RankingSignal, float]
    
    # Normalization settings
    normalize_scores: bool = True
    min_score: float = 0.0
    max_score: float = 1.0
    
    # Diversity settings
    diversity_penalty: float = 0.1
    max_similar_items: int = 3
    
    # Business settings
    price_boost_threshold: float = 100.0
    inventory_boost_threshold: int = 10
    
    # Personalization settings
    user_history_weight: float = 0.3
    session_behavior_weight: float = 0.2
    
    # Quality settings
    min_quality_threshold: float = 0.1
    quality_boost_factor: float = 1.2

@dataclass
class RankingResult:
    """Result of ranking calculation"""
    product_id: str
    final_score: float
    signal_scores: Dict[RankingSignal, float]
    ranking_factors: Dict[str, Any]
    position: int

class RobustRankingService:
    """
    Production-ready ranking service with multiple signals and robust scoring
    """
    
    def __init__(self, config: Optional[RankingConfig] = None):
        self.config = config or self._get_default_config()
        self._validate_config()
    
    def _get_default_config(self) -> RankingConfig:
        """Get default ranking configuration"""
        return RankingConfig(
            signal_weights={
                RankingSignal.RELEVANCE: 0.4,
                RankingSignal.PERSONALIZATION: 0.25,
                RankingSignal.BUSINESS_PRIORITY: 0.15,
                RankingSignal.DIVERSITY: 0.1,
                RankingSignal.FRESHNESS: 0.05,
                RankingSignal.POPULARITY: 0.03,
                RankingSignal.QUALITY: 0.02
            }
        )
    
    def _validate_config(self):
        """Validate ranking configuration"""
        total_weight = sum(self.config.signal_weights.values())
        if not math.isclose(total_weight, 1.0, abs_tol=0.01):
            raise ValueError(f"Signal weights must sum to 1.0, got {total_weight}")
        
        if self.config.min_score >= self.config.max_score:
            raise ValueError("min_score must be less than max_score")
    
    def rank_products(
        self, 
        products: List[Dict[str, Any]], 
        query: str,
        user_context: Optional[Dict[str, Any]] = None,
        domain: str = "clothing"
    ) -> List[RankingResult]:
        """
        Rank products using multiple signals and robust scoring
        
        Args:
            products: List of product dictionaries
            query: Search query
            user_context: User session and behavior data
            domain: Product domain (clothing, electronics, etc.)
        
        Returns:
            List of RankingResult objects sorted by final score
        """
        if not products:
            return []
        
        logger.info(f"Ranking {len(products)} products for query: '{query}' in domain: {domain}")
        
        # Calculate signal scores for each product
        signal_scores = self._calculate_signal_scores(products, query, user_context, domain)
        
        # Apply diversity penalty to avoid too many similar items
        signal_scores = self._apply_diversity_penalty(signal_scores, products)
        
        # Calculate final scores
        ranking_results = []
        for i, product in enumerate(products):
            product_id = product.get("id", f"product_{i}")
            
            # Calculate weighted final score
            final_score = 0.0
            signal_breakdown = {}
            
            for signal, weight in self.config.signal_weights.items():
                signal_score = signal_scores[signal][i]
                weighted_score = signal_score * weight
                final_score += weighted_score
                signal_breakdown[signal] = signal_score
            
            # Apply quality threshold
            if final_score < self.config.min_quality_threshold:
                final_score = 0.0
            
            # Normalize score if configured
            if self.config.normalize_scores:
                final_score = self._normalize_score(final_score)
            
            ranking_results.append(RankingResult(
                product_id=product_id,
                final_score=final_score,
                signal_scores=signal_breakdown,
                ranking_factors=self._extract_ranking_factors(product, signal_breakdown),
                position=0  # Will be set after sorting
            ))
        
        # Sort by final score and assign positions
        ranking_results.sort(key=lambda x: x.final_score, reverse=True)
        for i, result in enumerate(ranking_results):
            result.position = i + 1
        
        logger.info(f"Ranking completed. Top score: {ranking_results[0].final_score:.4f}, "
                   f"Bottom score: {ranking_results[-1].final_score:.4f}")
        
        return ranking_results
    
    def _calculate_signal_scores(
        self, 
        products: List[Dict[str, Any]], 
        query: str,
        user_context: Optional[Dict[str, Any]],
        domain: str
    ) -> Dict[RankingSignal, List[float]]:
        """Calculate all signal scores for products"""
        signal_scores = {}
        
        # Relevance signal
        signal_scores[RankingSignal.RELEVANCE] = self._calculate_relevance_scores(products, query)
        
        # Personalization signal
        signal_scores[RankingSignal.PERSONALIZATION] = self._calculate_personalization_scores(
            products, user_context
        )
        
        # Business priority signal
        signal_scores[RankingSignal.BUSINESS_PRIORITY] = self._calculate_business_scores(products, domain)
        
        # Diversity signal (calculated per product)
        signal_scores[RankingSignal.DIVERSITY] = [1.0] * len(products)  # Will be updated in diversity penalty
        
        # Freshness signal
        signal_scores[RankingSignal.FRESHNESS] = self._calculate_freshness_scores(products)
        
        # Popularity signal
        signal_scores[RankingSignal.POPULARITY] = self._calculate_popularity_scores(products)
        
        # Quality signal
        signal_scores[RankingSignal.QUALITY] = self._calculate_quality_scores(products)
        
        return signal_scores
    
    def _calculate_relevance_scores(self, products: List[Dict[str, Any]], query: str) -> List[float]:
        """Calculate relevance scores based on text similarity and keyword matching"""
        query_lower = query.lower()
        query_terms = set(query_lower.split())
        
        scores = []
        for product in products:
            # Get text fields to search
            title = product.get("title", "").lower()
            description = product.get("description", "").lower()
            category = product.get("category", "").lower()
            
            # Combine all text
            product_text = f"{title} {description} {category}"
            product_terms = set(product_text.split())
            
            # Calculate text similarity score
            text_similarity = self._calculate_text_similarity(query_terms, product_terms)
            
            # Calculate keyword match score
            keyword_score = self._calculate_keyword_match(query_lower, product_text)
            
            # Use existing score if available, otherwise calculate
            existing_score = product.get("score", 0.0)
            if existing_score > 0:
                # Blend existing score with calculated score
                relevance_score = (existing_score * 0.7) + (text_similarity * 0.3)
            else:
                relevance_score = (text_similarity * 0.6) + (keyword_score * 0.4)
            
            scores.append(min(1.0, max(0.0, relevance_score)))
        
        return scores
    
    def _calculate_text_similarity(self, query_terms: set, product_terms: set) -> float:
        """Calculate Jaccard similarity between query and product terms"""
        if not query_terms or not product_terms:
            return 0.0
        
        intersection = len(query_terms.intersection(product_terms))
        union = len(query_terms.union(product_terms))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_keyword_match(self, query: str, product_text: str) -> float:
        """Calculate keyword matching score"""
        if not query or not product_text:
            return 0.0
        
        # Exact phrase match
        if query in product_text:
            return 1.0
        
        # Individual word matches
        query_words = query.split()
        matches = sum(1 for word in query_words if word in product_text)
        
        return matches / len(query_words) if query_words else 0.0
    
    def _calculate_personalization_scores(
        self, 
        products: List[Dict[str, Any]], 
        user_context: Optional[Dict[str, Any]]
    ) -> List[float]:
        """Calculate personalization scores based on user behavior"""
        if not user_context:
            return [0.5] * len(products)  # Neutral score when no user context
        
        scores = []
        user_preferences = user_context.get("preferences", {})
        user_history = user_context.get("history", [])
        
        for product in products:
            personalization_score = 0.5  # Base score
            
            # Price preference
            price = float(product.get("price", 0))
            preferred_price_range = user_preferences.get("price_range", [0, 1000])
            if preferred_price_range[0] <= price <= preferred_price_range[1]:
                personalization_score += 0.2
            
            # Category preference
            category = product.get("category", "").lower()
            preferred_categories = user_preferences.get("categories", [])
            if category in preferred_categories:
                personalization_score += 0.2
            
            # Brand preference
            title = product.get("title", "").lower()
            preferred_brands = user_preferences.get("brands", [])
            if any(brand.lower() in title for brand in preferred_brands):
                personalization_score += 0.1
            
            # Recent activity boost
            recent_views = user_context.get("recent_views", [])
            if product.get("id") in recent_views:
                personalization_score += 0.1
            
            scores.append(min(1.0, max(0.0, personalization_score)))
        
        return scores
    
    def _calculate_business_scores(self, products: List[Dict[str, Any]], domain: str) -> List[float]:
        """Calculate business priority scores"""
        scores = []
        
        for product in products:
            business_score = 0.5  # Base score
            
            # Price-based business logic
            price = float(product.get("price", 0))
            if price > self.config.price_boost_threshold:
                business_score += 0.2  # Boost high-value items
            elif price < 20:
                business_score += 0.1  # Boost low-price items for volume
            
            # Inventory-based logic
            inventory = product.get("inventory", 0)
            if inventory > self.config.inventory_boost_threshold:
                business_score += 0.1  # Boost items with good inventory
            
            # Domain-specific business logic
            if domain == "clothing":
                # Boost seasonal items
                title = product.get("title", "").lower()
                if any(season in title for season in ["summer", "winter", "spring", "fall"]):
                    business_score += 0.1
            elif domain == "electronics":
                # Boost new/trending tech
                if any(keyword in title for keyword in ["new", "latest", "2024", "2025"]):
                    business_score += 0.15
            
            # Promotional boost
            if product.get("on_sale", False):
                business_score += 0.1
            
            scores.append(min(1.0, max(0.0, business_score)))
        
        return scores
    
    def _calculate_freshness_scores(self, products: List[Dict[str, Any]]) -> List[float]:
        """Calculate freshness scores based on product recency"""
        scores = []
        
        for product in products:
            # Use creation date or last updated date
            created_at = product.get("created_at", product.get("updated_at"))
            if created_at:
                # Simple freshness calculation (would be more sophisticated in production)
                freshness_score = 0.8  # Assume recent for demo
            else:
                freshness_score = 0.5  # Neutral for unknown dates
            
            scores.append(freshness_score)
        
        return scores
    
    def _calculate_popularity_scores(self, products: List[Dict[str, Any]]) -> List[float]:
        """Calculate popularity scores based on views, clicks, etc."""
        scores = []
        
        for product in products:
            # Use available popularity metrics
            views = product.get("views", 0)
            clicks = product.get("clicks", 0)
            purchases = product.get("purchases", 0)
            
            # Calculate popularity score
            popularity_score = 0.5  # Base score
            
            if views > 100:
                popularity_score += 0.2
            if clicks > 10:
                popularity_score += 0.2
            if purchases > 5:
                popularity_score += 0.1
            
            scores.append(min(1.0, max(0.0, popularity_score)))
        
        return scores
    
    def _calculate_quality_scores(self, products: List[Dict[str, Any]]) -> List[float]:
        """Calculate quality scores based on product attributes"""
        scores = []
        
        for product in products:
            quality_score = 0.5  # Base score
            
            # Title quality (length, descriptiveness)
            title = product.get("title", "")
            if len(title) > 50:  # Descriptive titles
                quality_score += 0.1
            
            # Description quality
            description = product.get("description", "")
            if len(description) > 100:  # Detailed descriptions
                quality_score += 0.1
            
            # Image quality indicator
            image_url = product.get("image_url", "")
            if image_url and "placeholder" not in image_url:
                quality_score += 0.1
            
            # Price reasonableness (not too low or too high)
            price = float(product.get("price", 0))
            if 10 <= price <= 500:  # Reasonable price range
                quality_score += 0.1
            
            scores.append(min(1.0, max(0.0, quality_score)))
        
        return scores
    
    def _apply_diversity_penalty(
        self, 
        signal_scores: Dict[RankingSignal, List[float]], 
        products: List[Dict[str, Any]]
    ) -> Dict[RankingSignal, List[float]]:
        """Apply diversity penalty to avoid too many similar items"""
        if len(products) <= self.config.max_similar_items:
            return signal_scores
        
        # Calculate similarity between products
        diversity_scores = [1.0] * len(products)
        
        for i in range(len(products)):
            for j in range(i + 1, min(i + self.config.max_similar_items + 1, len(products))):
                similarity = self._calculate_product_similarity(products[i], products[j])
                if similarity > 0.7:  # High similarity threshold
                    diversity_scores[j] -= self.config.diversity_penalty
        
        signal_scores[RankingSignal.DIVERSITY] = diversity_scores
        return signal_scores
    
    def _calculate_product_similarity(self, product1: Dict[str, Any], product2: Dict[str, Any]) -> float:
        """Calculate similarity between two products"""
        # Simple similarity based on category and title
        category1 = product1.get("category", "").lower()
        category2 = product2.get("category", "").lower()
        
        if category1 != category2:
            return 0.0
        
        # Title similarity
        title1 = set(product1.get("title", "").lower().split())
        title2 = set(product2.get("title", "").lower().split())
        
        if not title1 or not title2:
            return 0.0
        
        intersection = len(title1.intersection(title2))
        union = len(title1.union(title2))
        
        return intersection / union if union > 0 else 0.0
    
    def _normalize_score(self, score: float) -> float:
        """Normalize score to configured range"""
        # Simple min-max normalization
        return max(self.config.min_score, min(self.config.max_score, score))
    
    def _extract_ranking_factors(self, product: Dict[str, Any], signal_scores: Dict[RankingSignal, float]) -> Dict[str, Any]:
        """Extract ranking factors for transparency"""
        return {
            "price": product.get("price", 0),
            "category": product.get("category", ""),
            "inventory": product.get("inventory", 0),
            "on_sale": product.get("on_sale", False),
            "views": product.get("views", 0),
            "clicks": product.get("clicks", 0),
            "signal_breakdown": {signal.value: score for signal, score in signal_scores.items()}
        }
    
    def get_ranking_explanation(self, ranking_result: RankingResult) -> str:
        """Generate human-readable explanation of ranking"""
        factors = ranking_result.ranking_factors
        
        explanation_parts = []
        
        # Top contributing signals
        sorted_signals = sorted(
            ranking_result.signal_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        top_signal = sorted_signals[0]
        explanation_parts.append(f"Top signal: {top_signal[0].value} ({top_signal[1]:.2f})")
        
        # Business factors
        if factors.get("on_sale"):
            explanation_parts.append("Currently on sale")
        
        if factors.get("price", 0) > self.config.price_boost_threshold:
            explanation_parts.append("High-value item")
        
        if factors.get("inventory", 0) > self.config.inventory_boost_threshold:
            explanation_parts.append("Good inventory levels")
        
        return "; ".join(explanation_parts)
