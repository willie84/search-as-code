from typing import List, Dict, Any
from fastapi import HTTPException
import logging
from services.weaviate_service import WeaviateService
from services.config_manager import config_manager
from services.domain_config_service import DomainConfigService

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, domain: str = "clothing"):
        self.weaviate_service = WeaviateService()
        self.domain = domain
        self.domain_config_service = DomainConfigService()
        
    async def hybrid_search(self, query: str, query_type: str = "text", image: Any = None, limit: int = 10, domain: str = None) -> List[Dict[str, Any]]:
        """Perform hybrid search using domain-specific configuration"""
        try:
            # Use domain-specific configuration if available
            if domain and self.domain_config_service.get_domain_config(domain):
                retrieval_weights = self.domain_config_service.get_retrieval_weights(domain)
                ranking_config = self.domain_config_service.get_ranking_config(domain)
                # Use default models for now, could be domain-specific in future
                retrieval_models = config_manager.get_retrieval_models()
            else:
                # Fallback to default configuration
                retrieval_weights = config_manager.get_retrieval_weights()
                retrieval_models = config_manager.get_retrieval_models()
                ranking_config = config_manager.get_ranking_config()
            
            logger.info(f"Using retrieval weights: {retrieval_weights}")
            logger.info(f"Using models: {retrieval_models}")
            
            # Perform multi-modal retrieval
            results = []
            
            # Semantic search (configurable weight, default 0.6)
            if retrieval_weights["semantic"] > 0:
                semantic_results = await self._semantic_search(
                    query, 
                    model=retrieval_models["semantic_model"],
                    weight=retrieval_weights["semantic"]
                )
                results.extend(semantic_results)
            
            # Keyword search (configurable weight, default 0.2)  
            if retrieval_weights["keyword"] > 0:
                keyword_results = await self._keyword_search(
                    query,
                    weight=retrieval_weights["keyword"]
                )
                results.extend(keyword_results)
            
            # Visual search (configurable weight, default 0.2)
            if retrieval_weights["visual"] > 0 and (query_type == "image" or image is not None):
                visual_input = image if image is not None else query
                visual_results = await self._visual_search(
                    visual_input,
                    model=retrieval_models["visual_model"],
                    weight=retrieval_weights["visual"]
                )
                results.extend(visual_results)
            
            # Apply ranking with configured objectives and features
            ranked_results = await self._apply_ranking(results, ranking_config)
            
            return ranked_results[:limit]
            
        except Exception as e:
            logger.error(f"Error in hybrid_search: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    async def _semantic_search(self, query: str, model: str, weight: float) -> List[Dict[str, Any]]:
        """Perform semantic search using specified model"""
        try:
            # Use Weaviate for semantic/vector search
            results = await self.weaviate_service.search_by_text(query, limit=20)
            logger.info(f"Semantic search returned {len(results)} results")
            
            # Apply semantic weight and add similarity scores
            for result in results:
                distance = result.get("_additional", {}).get("distance", 0.5)
                # Convert distance to similarity score (1 - distance, then apply weight)
                similarity = 1 - distance
                result["semantic_score"] = similarity * weight
                result["text_similarity"] = similarity
                result["search_type"] = "semantic"
                result["model_used"] = model
            
            return results
        except Exception as e:
            logger.error(f"Error in semantic search: {str(e)}")
            return []

    async def _keyword_search(self, query: str, weight: float) -> List[Dict[str, Any]]:
        """Perform keyword/BM25 search"""
        try:
            # Use Weaviate's BM25 search capability
            results = await self.weaviate_service.search_by_keywords(query, limit=20)
            logger.info(f"Keyword search returned {len(results)} results")
            
            # Apply keyword weight and add similarity scores
            for result in results:
                score = float(result.get("_additional", {}).get("score", 0.5))
                result["keyword_score"] = score * weight
                result["text_similarity"] = score
                result["search_type"] = "keyword"
            
            return results
        except Exception as e:
            logger.error(f"Error in keyword search: {str(e)}")
            return []

    async def _visual_search(self, image_input: Any, model: str, weight: float) -> List[Dict[str, Any]]:
        """Perform visual search using specified model"""
        try:
            # Use Weaviate for image search
            results = await self.weaviate_service.search_by_image(image_input, limit=20)
            
            # Apply visual weight and add similarity scores
            for result in results:
                result["visual_score"] = result.get("_additional", {}).get("distance", 0.5) * weight
                result["visual_similarity"] = result.get("_additional", {}).get("distance", 0.5)
                result["search_type"] = "visual"
                result["model_used"] = model
            
            return results
        except Exception as e:
            logger.error(f"Error in visual search: {str(e)}")
            return []

    async def _apply_ranking(self, results: List[Dict], ranking_config: Dict[str, Any]) -> List[Dict]:
        """Apply ranking using configured objectives, features, and weights"""
        objectives = ranking_config.get("objectives", [])
        features = ranking_config.get("features", [])
        weights = ranking_config.get("weights", {})
        
        logger.info(f"Applying ranking with objectives: {objectives}")
        logger.info(f"Using features: {features}")
        logger.info(f"Feature weights: {weights}")
        
        # Remove duplicates based on product ID
        unique_results = {}
        for result in results:
            product_id = result.get("id") or result.get("product_id")
            if product_id not in unique_results:
                unique_results[product_id] = result
            else:
                # Merge scores from different search types
                existing = unique_results[product_id]
                existing["semantic_score"] = max(
                    existing.get("semantic_score", 0),
                    result.get("semantic_score", 0)
                )
                existing["keyword_score"] = max(
                    existing.get("keyword_score", 0),
                    result.get("keyword_score", 0)
                )
                existing["visual_score"] = max(
                    existing.get("visual_score", 0),
                    result.get("visual_score", 0)
                )
        
        results = list(unique_results.values())
        
        # Calculate composite scores based on configured features and weights
        for result in results:
            score = 0.0
            
            # Relevance component
            if "text_similarity" in features:
                text_sim = max(
                    result.get("text_similarity", 0),
                    result.get("semantic_score", 0),
                    result.get("keyword_score", 0)
                )
                score += text_sim * weights.get("relevance", 0.5)
            
            if "visual_similarity" in features:
                visual_sim = result.get("visual_similarity", 0)
                score += visual_sim * weights.get("relevance", 0.5)
            
            # Personalization component
            if "session_personalization" in features:
                personalization_score = self._calculate_personalization_score(result)
                score += personalization_score * weights.get("personalization", 0.3)
            
            # Business priority component (price, popularity, etc.)
            business_score = self._calculate_business_score(result)
            score += business_score * weights.get("business_priority", 0.2)
            
            # Apply objective functions
            for objective in objectives:
                if objective == "click_through_rate":
                    score *= result.get("ctr_boost", 1.0)
                elif objective == "revenue":
                    score *= self._calculate_revenue_boost(result)
                elif objective == "diversity":
                    score *= result.get("diversity_penalty", 1.0)
            
            result["final_score"] = score
        
        # Sort by final score
        return sorted(results, key=lambda x: x.get("final_score", 0), reverse=True)

    def _calculate_personalization_score(self, result: Dict[str, Any]) -> float:
        """Calculate personalization score based on user history/preferences"""
        # Placeholder for personalization logic
        # In production, this would use user session data, purchase history, etc.
        return 0.5

    def _calculate_business_score(self, result: Dict[str, Any]) -> float:
        """Calculate business priority score (margin, inventory, etc.)"""
        price = float(result.get("price", 0))
        
        # Higher scores for mid-range prices (business logic example)
        if 20 <= price <= 100:
            return 0.8
        elif 10 <= price <= 200:
            return 0.6
        else:
            return 0.4

    def _calculate_revenue_boost(self, result: Dict[str, Any]) -> float:
        """Calculate revenue optimization boost"""
        price = float(result.get("price", 0))
        
        # Boost higher-priced items slightly for revenue optimization
        if price > 100:
            return 1.2
        elif price > 50:
            return 1.1
        else:
            return 1.0

    # Legacy method for backward compatibility
    def rank_results(self, text_results: List[Dict[str, Any]], image_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Legacy ranking method - maintained for backward compatibility"""
        # Get legacy ranking weights from config
        ranking_weights = config_manager.get_legacy_ranking_weights()
        
        # Apply legacy weights
        for result in text_results:
            result["score"] = result.get("score", 0.5) * ranking_weights.get("text", 1.0)
        
        for result in image_results:
            result["score"] = result.get("score", 0.5) * ranking_weights.get("image", 1.0)
        
        # Combine and sort
        combined_results = text_results + image_results
        return sorted(combined_results, key=lambda x: x.get('score', 0), reverse=True)[:10]

    async def log_feedback(self, feedback_data: Dict[str, Any]) -> None:
        """Log user feedback for future ranking improvements"""
        try:
            await self.weaviate_service.log_feedback(feedback_data)
            logger.info(f"Feedback logged: {feedback_data}")
        except Exception as e:
            logger.error(f"Error logging feedback: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))