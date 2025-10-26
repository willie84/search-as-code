from pydantic import BaseModel, Field
from typing import List, Optional, Union

class Product(BaseModel):
    id: Union[str, int] = Field(..., description="Product ID (string or integer)")
    title: str
    description: str
    price: float
    image_url: str
    category: Optional[str] = None

class EnrichedProduct(Product):
    color: Optional[str]
    style: Optional[str]
    fabric: Optional[str]
    occasion: Optional[str]
    vector_embedding: List[float]  # Assuming a list of floats for the embedding

class SearchRequest(BaseModel):
    query: str
    image: Optional[str]  # Base64 encoded image or URL

class SearchResponse(BaseModel):
    products: List[EnrichedProduct]
    total_results: int

class Feedback(BaseModel):
    product_id: str
    user_action: str  # e.g., 'click', 'favorite'