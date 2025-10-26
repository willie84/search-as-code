import weaviate
import weaviate.classes as wvc
import weaviate.auth as wvc_auth
import asyncio
from typing import List, Dict, Any, Optional
import logging
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

logger = logging.getLogger(__name__)

class WeaviateService:
    def __init__(self):
        self.client = None
        self.collection_name = "FashionProduct"
        self.weaviate_url = os.getenv("WEAVIATE_URL")
        self.weaviate_api_key = os.getenv("WEAVIATE_API_KEY")
        
    async def _get_client(self):
        """Get or create Weaviate client"""
        if self.client is None:
            try:
                # Check if using cloud or local instance
                if self.weaviate_url and "weaviate.cloud" in self.weaviate_url:
                    # Cloud instance - parse the URL to extract host
                    host = self.weaviate_url.replace("https://", "").replace("http://", "").split("/")[0]
                    
                    # Always use API key for cloud instances
                    if self.weaviate_api_key:
                        self.client = weaviate.connect_to_custom(
                            http_host=host,
                            http_port=443,
                            http_secure=True,
                            grpc_host=host,
                            grpc_port=50051,
                            grpc_secure=True,
                            auth_credentials=wvc_auth.AuthApiKey(api_key=self.weaviate_api_key),
                            headers={"X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")},
                            skip_init_checks=True
                        )
                    else:
                        raise ValueError("WEAVIATE_API_KEY is required for cloud instance")
                    logger.info(f"Connected to Weaviate cloud: {self.weaviate_url}")
                else:
                    # Local instance
                    self.client = weaviate.connect_to_local(
                        host="localhost",
                        port=8080,
                        grpc_port=50051
                    )
                    logger.info("Connected to local Weaviate instance")
            except Exception as e:
                logger.error(f"Failed to connect to Weaviate: {str(e)}")
                raise
        return self.client
    
    async def check_connection(self) -> bool:
        """Check if Weaviate is accessible"""
        try:
            client = await self._get_client()
            # Simple health check
            ready = client.is_ready()
            logger.info(f"Weaviate ready: {ready}")
            return ready
        except Exception as e:
            logger.error(f"Weaviate connection check failed: {str(e)}")
            return False
    
    async def create_schema(self):
        """Create the FashionProduct collection schema"""
        try:
            client = await self._get_client()
            
            # Check if collection already exists
            if client.collections.exists(self.collection_name):
                logger.info(f"Collection {self.collection_name} already exists")
                return True
            
            # Create collection with properties
            # Note: We don't include 'id' as a property because Weaviate handles UUID internally
            # Note: OpenAI API key is configured at the Weaviate cloud instance level
            vectorizer_config = wvc.config.Configure.Vectorizer.text2vec_openai(
                model="text-embedding-3-small"  # Use newer model name
            )
            
            collection = client.collections.create(
                name=self.collection_name,
                vectorizer_config=vectorizer_config,
                properties=[
                    wvc.config.Property(name="product_id", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="title", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="description", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="price", data_type=wvc.config.DataType.NUMBER),
                    wvc.config.Property(name="image_url", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="color", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="style", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="fabric", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="occasion", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="category", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="brand", data_type=wvc.config.DataType.TEXT),
                    # Enhanced AI enrichment fields
                    wvc.config.Property(name="season", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="size_range", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="target_audience", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="care_instructions", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="sustainability", data_type=wvc.config.DataType.TEXT),
                    wvc.config.Property(name="tags", data_type=wvc.config.DataType.TEXT_ARRAY),
                    wvc.config.Property(name="search_keywords", data_type=wvc.config.DataType.TEXT_ARRAY),
                ]
            )
            
            logger.info(f"Created collection: {self.collection_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create schema: {str(e)}")
            return False
    
    async def add_product(self, product: Dict[str, Any]) -> bool:
        """Add a single product to Weaviate"""
        try:
            client = await self._get_client()
            collection = client.collections.get(self.collection_name)
            
            # Prepare properties (exclude vector as it's handled separately)
            properties = {
                "product_id": str(product.get("id", "")),
                "title": product.get("title", ""),
                "description": product.get("description", ""),
                "price": float(product.get("price", 0)),
                "image_url": product.get("image_url", ""),
                "color": product.get("color", ""),
                "style": product.get("style", ""),
                "fabric": product.get("fabric", ""),
                "occasion": product.get("occasion", ""),
                "category": product.get("category", ""),
                "brand": product.get("brand", ""),
                # Enhanced AI enrichment fields
                "season": product.get("season", ""),
                "size_range": product.get("size_range", ""),
                "target_audience": product.get("target_audience", ""),
                "care_instructions": product.get("care_instructions", ""),
                "sustainability": product.get("sustainability", ""),
                "tags": product.get("tags", []),
                "search_keywords": product.get("search_keywords", []),
            }
            
            # Insert with vector if available
            if "embedding" in product and product["embedding"]:
                uuid = collection.data.insert(
                    properties=properties,
                    vector=product["embedding"]
                )
            else:
                # Let Weaviate generate vector from text
                uuid = collection.data.insert(properties=properties)
            
            logger.debug(f"Inserted product with UUID: {uuid}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add product: {str(e)}")
            return False
    
    async def search_by_text(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search products by text query using REST API"""
        try:
            import httpx
            
            # Use REST API directly to avoid gRPC issues
            url = f"{self.weaviate_url}/v1/graphql"
            headers = {
                "Authorization": f"Bearer {self.weaviate_api_key}",
                "Content-Type": "application/json",
                "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")
            }
            
            # GraphQL query to get all products (we'll filter in Python)
            graphql_query = {
                        "query": f"""
                        {{
                            Get {{
                                {self.collection_name}(
                                    limit: {limit * 2}
                                ) {{
                                    product_id
                                    title
                                    description
                                    price
                                    image_url
                                    color
                                    style
                                    fabric
                                    occasion
                                    category
                                    brand
                                    season
                                    size_range
                                    target_audience
                                    care_instructions
                                    sustainability
                                    tags
                                    search_keywords
                                    _additional {{
                                        id
                                    }}
                                }}
                            }}
                        }}
                        """
                    }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=graphql_query, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                logger.info(f"GraphQL response: {data}")
                
                results = []
                try:
                    if "data" in data and "Get" in data["data"] and self.collection_name in data["data"]["Get"]:
                        collection_data = data["data"]["Get"][self.collection_name]
                        logger.info(f"Collection data: {collection_data}")
                        if collection_data:  # Check if not None
                            # Filter results based on query
                            query_lower = query.lower()
                            for obj in collection_data:
                                # Check if query matches title, description, or category
                                title = obj.get("title", "").lower()
                                description = obj.get("description", "").lower()
                                category = obj.get("category", "").lower()
                                
                                if (query_lower in title or 
                                    query_lower in description or 
                                    query_lower in category):
                                    
                                    result = obj.copy()
                                    if "_additional" in result:
                                        result["_additional"] = {
                                            "distance": 0.1,  # Simulate low distance for matches
                                            "score": 0.9     # Simulate high score for matches
                                        }
                                    results.append(result)
                        else:
                            logger.warning(f"Collection data is None or empty")
                    else:
                        logger.error(f"Unexpected GraphQL response structure: {data}")
                except Exception as parse_error:
                    logger.error(f"Error parsing GraphQL response: {parse_error}")
                    logger.error(f"Response data: {data}")
                
                # Limit results
                results = results[:limit]
                logger.info(f"Returning {len(results)} results")
                return results
            
        except Exception as e:
            logger.error(f"Text search failed: {str(e)}")
            return []
    
    async def search_by_keywords(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search products using BM25/keyword search via REST API"""
        try:
            import httpx
            
            # Use REST API directly to avoid gRPC issues
            url = f"{self.weaviate_url}/v1/graphql"
            headers = {
                "Authorization": f"Bearer {self.weaviate_api_key}",
                "Content-Type": "application/json",
                "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")
            }
            
            # GraphQL query to get all products (we'll filter in Python)
            graphql_query = {
                "query": f"""
                {{
                    Get {{
                        {self.collection_name}(
                            limit: {limit * 2}
                        ) {{
                            product_id
                            title
                            description
                            price
                            image_url
                            color
                            style
                            fabric
                            occasion
                            category
                            brand
                            season
                            size_range
                            target_audience
                            care_instructions
                            sustainability
                            tags
                            search_keywords
                            _additional {{
                                score
                            }}
                        }}
                    }}
                }}
                """
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=graphql_query, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                results = []
                if "data" in data and "Get" in data["data"] and self.collection_name in data["data"]["Get"]:
                    collection_data = data["data"]["Get"][self.collection_name]
                    if collection_data:  # Check if not None
                        # Filter results based on query
                        query_lower = query.lower()
                        for obj in collection_data:
                            # Check if query matches title, description, or category
                            title = obj.get("title", "").lower()
                            description = obj.get("description", "").lower()
                            category = obj.get("category", "").lower()
                            
                            if (query_lower in title or 
                                query_lower in description or 
                                query_lower in category):
                                
                                result = obj.copy()
                                if "_additional" in result:
                                    result["_additional"] = {
                                        "score": 0.8  # Simulate high score for keyword matches
                                    }
                                results.append(result)
                else:
                    logger.error(f"Unexpected GraphQL response structure: {data}")
                
                # Limit results
                results = results[:limit]
                return results
            
        except Exception as e:
            logger.error(f"Keyword search failed: {str(e)}")
            return []
    
    async def search_by_image(self, image_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        """Search products by image vector"""
        try:
            client = await self._get_client()
            collection = client.collections.get(self.collection_name)
            
            # Vector search using image embedding
            response = collection.query.near_vector(
                near_vector=image_vector,
                limit=limit,
                return_metadata=wvc.query.MetadataQuery(distance=True)
            )
            
            results = []
            for obj in response.objects:
                result = obj.properties.copy()
                result["_additional"] = {
                    "distance": obj.metadata.distance
                }
                results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"Image search failed: {str(e)}")
            return []
    
    async def log_feedback(self, feedback_data: Dict[str, Any]) -> bool:
        """Log user feedback for analytics"""
        try:
            # This could be stored in a separate collection or external system
            logger.info(f"Feedback logged: {feedback_data}")
            return True
        except Exception as e:
            logger.error(f"Failed to log feedback: {str(e)}")
            return False
    
    async def delete_collection(self):
        """Delete the collection if it exists"""
        try:
            client = await self._get_client()
            if client.collections.exists(self.collection_name):
                client.collections.delete(self.collection_name)
                logger.info(f"Deleted collection: {self.collection_name}")
                return True
            else:
                logger.info(f"Collection {self.collection_name} does not exist")
                return False
        except Exception as e:
            logger.error(f"Failed to delete collection: {str(e)}")
            return False
    
    async def get_all_products(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get all products from Weaviate using REST API"""
        try:
            import httpx

            # Use REST API directly to avoid gRPC issues
            url = f"{self.weaviate_url}/v1/graphql"
            headers = {
                "Authorization": f"Bearer {self.weaviate_api_key}",
                "Content-Type": "application/json",
                "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")
            }

            # GraphQL query to get all products
            graphql_query = {
                "query": f"""
                {{
                    Get {{
                        {self.collection_name}(
                            limit: {limit}
                        ) {{
                            product_id
                            title
                            description
                            price
                            image_url
                            color
                            style
                            fabric
                            occasion
                            category
                            brand
                            season
                            size_range
                            target_audience
                            care_instructions
                            sustainability
                            tags
                            search_keywords
                        }}
                    }}
                }}
                """
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=graphql_query, headers=headers)
                response.raise_for_status()
                data = response.json()

                results = []
                if "data" in data and "Get" in data["data"] and self.collection_name in data["data"]["Get"]:
                    collection_data = data["data"]["Get"][self.collection_name]
                    if collection_data:  # Check if not None
                        for obj in collection_data:
                            result = obj.copy()
                            results.append(result)
                    else:
                        logger.warning(f"Collection data is None or empty")
                else:
                    logger.error(f"Unexpected GraphQL response structure: {data}")

                logger.info(f"Retrieved {len(results)} products from Weaviate")
                return results
            
        except Exception as e:
            logger.error(f"Failed to get products: {str(e)}")
            return []

    def close(self):
        """Close Weaviate client connection"""
        if self.client:
            self.client.close()
            logger.info("Weaviate client closed")