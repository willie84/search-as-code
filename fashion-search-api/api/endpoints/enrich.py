from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.enrichment_service import EnrichmentService

router = APIRouter()

class Product(BaseModel):
    id: str
    title: str
    description: str
    price: float
    image_url: str

class EnrichedProduct(BaseModel):
    id: str
    title: str
    description: str
    price: float
    image_url: str
    color: str
    style: str
    fabric: str
    occasion: str
    embedding: list

@router.post("/enrich", response_model=list[EnrichedProduct])
async def enrich(product_list: list[Product]):
    try:
        enrichment_service = EnrichmentService()
        enriched_products = []
        for product in product_list:
            enriched = await enrichment_service.enrich_product(product.dict())
            enriched_products.append(enriched)
        return enriched_products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))