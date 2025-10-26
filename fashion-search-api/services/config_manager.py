import yaml
import asyncio
from pathlib import Path
from typing import Dict, Any, List
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import logging

logger = logging.getLogger(__name__)

class ConfigManager:
    def __init__(self, config_path: str = "config/search.yaml"):
        self.config_path = Path(config_path)
        self.config_data: Dict[str, Any] = {}
        self.observer = None
        self._load_config()
        
    def _load_config(self):
        """Load configuration from YAML file"""
        try:
            with open(self.config_path, 'r') as file:
                self.config_data = yaml.safe_load(file)
            logger.info(f"Configuration loaded from {self.config_path}")
        except FileNotFoundError:
            logger.error(f"Configuration file not found: {self.config_path}")
            self.config_data = self._get_default_config()
        except yaml.YAMLError as e:
            logger.error(f"Error parsing YAML: {e}")
            self.config_data = self._get_default_config()
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Return default configuration if file is missing or invalid"""
        return {
            "retrieval": {
                "semantic": {"weight": 0.6, "model": "bge-large-en"},
                "keyword": {"weight": 0.2},
                "visual": {"weight": 0.2, "model": "clip-vit-b32"}
            },
            "ranking": {
                "objectives": ["click_through_rate", "revenue", "diversity"],
                "features": ["text_similarity", "visual_similarity", "session_personalization"],
                "weights": {
                    "relevance": 0.5,
                    "personalization": 0.3,
                    "business_priority": 0.2
                }
            }
        }
    
    def get_config(self) -> Dict[str, Any]:
        """Get current configuration"""
        return self.config_data.copy()
    
    # New methods for updated structure
    def get_retrieval_config(self) -> Dict[str, Any]:
        """Get retrieval configuration"""
        return self.config_data.get("retrieval", {
            "semantic": {"weight": 0.6, "model": "bge-large-en"},
            "keyword": {"weight": 0.2},
            "visual": {"weight": 0.2, "model": "clip-vit-b32"}
        })
    
    def get_ranking_config(self) -> Dict[str, Any]:
        """Get ranking configuration"""
        return self.config_data.get("ranking", {
            "objectives": ["click_through_rate", "revenue", "diversity"],
            "features": ["text_similarity", "visual_similarity", "session_personalization"],
            "weights": {
                "relevance": 0.5,
                "personalization": 0.3,
                "business_priority": 0.2
            }
        })
    
    def get_retrieval_weights(self) -> Dict[str, float]:
        """Get retrieval weights for semantic, keyword, visual"""
        retrieval = self.get_retrieval_config()
        return {
            "semantic": retrieval.get("semantic", {}).get("weight", 0.6),
            "keyword": retrieval.get("keyword", {}).get("weight", 0.2),
            "visual": retrieval.get("visual", {}).get("weight", 0.2)
        }
    
    def get_retrieval_models(self) -> Dict[str, str]:
        """Get retrieval models configuration"""
        retrieval = self.get_retrieval_config()
        return {
            "semantic_model": retrieval.get("semantic", {}).get("model", "bge-large-en"),
            "visual_model": retrieval.get("visual", {}).get("model", "clip-vit-b32")
        }
    
    def get_ranking_objectives(self) -> List[str]:
        """Get ranking objectives"""
        return self.get_ranking_config().get("objectives", ["click_through_rate", "revenue", "diversity"])
    
    def get_ranking_features(self) -> List[str]:
        """Get ranking features"""
        return self.get_ranking_config().get("features", ["text_similarity", "visual_similarity", "session_personalization"])
    
    def get_ranking_weights(self) -> Dict[str, float]:
        """Get ranking weights"""
        return self.get_ranking_config().get("weights", {
            "relevance": 0.5,
            "personalization": 0.3,
            "business_priority": 0.2
        })
    
    # Legacy methods (maintained for backward compatibility)
    def get_legacy_ranking_weights(self) -> Dict[str, float]:
        """Get legacy ranking weights configuration"""
        return self.config_data.get("ranking_weights", {"text": 1.0, "image": 1.0})
    
    def get_legacy_retrieval_models(self) -> Dict[str, str]:
        """Get legacy retrieval models configuration"""
        return self.config_data.get("retrieval_models", {
            "text_model": "bm25",
            "image_model": "open_clip"
        })
    
    def get_objective_function(self) -> str:
        """Get objective function configuration"""
        return self.config_data.get("objective_functions", {}).get("ranking", "weighted_sum")

class ConfigFileHandler(FileSystemEventHandler):
    def __init__(self, config_manager: ConfigManager):
        self.config_manager = config_manager
        
    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith('search.yaml'):
            logger.info("Configuration file changed, reloading...")
            self.config_manager._load_config()

# Global config manager instance
config_manager = ConfigManager()

def start_config_watcher():
    """Start watching the configuration file for changes"""
    config_handler = ConfigFileHandler(config_manager)
    observer = Observer()
    observer.schedule(config_handler, str(config_manager.config_path.parent), recursive=False)
    observer.start()
    config_manager.observer = observer
    logger.info("Configuration file watcher started")

def stop_config_watcher():
    """Stop watching the configuration file"""
    if config_manager.observer:
        config_manager.observer.stop()
        config_manager.observer.join()
        logger.info("Configuration file watcher stopped")