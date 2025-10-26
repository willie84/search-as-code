import yaml
from typing import Dict, Any, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class DomainConfigService:
    def __init__(self):
        self.config_dir = Path(__file__).parent.parent / "config" / "domains"
        self._configs = {}
        self._load_all_configs()
    
    def _load_all_configs(self):
        """Load all domain configurations"""
        try:
            for config_file in self.config_dir.glob("*.yaml"):
                domain = config_file.stem
                with open(config_file, 'r') as f:
                    self._configs[domain] = yaml.safe_load(f)
                logger.info(f"Loaded domain config: {domain}")
        except Exception as e:
            logger.error(f"Error loading domain configs: {e}")
    
    def get_domain_config(self, domain: str) -> Optional[Dict[str, Any]]:
        """Get configuration for a specific domain"""
        return self._configs.get(domain)
    
    def get_available_domains(self) -> list:
        """Get list of available domains"""
        return list(self._configs.keys())
    
    def get_retrieval_weights(self, domain: str) -> Dict[str, float]:
        """Get retrieval weights for domain"""
        config = self.get_domain_config(domain)
        if not config:
            return {"semantic": 0.6, "keyword": 0.2, "visual": 0.2}
        
        retrieval = config.get("retrieval", {})
        return {
            "semantic": retrieval.get("semantic", {}).get("weight", 0.6),
            "keyword": retrieval.get("keyword", {}).get("weight", 0.2),
            "visual": retrieval.get("visual", {}).get("weight", 0.2)
        }
    
    def get_ranking_config(self, domain: str) -> Dict[str, Any]:
        """Get ranking configuration for domain"""
        config = self.get_domain_config(domain)
        if not config:
            return {
                "objectives": ["click_through_rate", "diversity"],
                "features": ["text_similarity", "visual_similarity"],
                "weights": {"relevance": 0.9, "personalization": 0.1, "business_priority": 0.0}
            }
        
        ranking = config.get("ranking", {})
        return {
            "objectives": ranking.get("objectives", ["click_through_rate", "diversity"]),
            "features": ranking.get("features", ["text_similarity", "visual_similarity"]),
            "weights": ranking.get("weights", {"relevance": 0.9, "personalization": 0.1, "business_priority": 0.0})
        }
    
    def get_domain_factors(self, domain: str) -> Dict[str, float]:
        """Get domain-specific ranking factors"""
        config = self.get_domain_config(domain)
        if not config:
            return {}
        
        factors_key = f"{domain}_factors"
        return config.get(factors_key, {})
    
    def get_search_behavior(self, domain: str) -> Dict[str, Any]:
        """Get domain-specific search behavior settings"""
        config = self.get_domain_config(domain)
        if not config:
            return {}
        
        return config.get("search_behavior", {})
    
    def reload_configs(self):
        """Reload all domain configurations"""
        self._configs = {}
        self._load_all_configs()
        logger.info("Domain configurations reloaded")
