from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import asyncio
from services.weaviate_service import WeaviateService
from services.enrichment_service import EnrichmentService
from api.endpoints.auth import get_current_admin

router = APIRouter()

class BulkUploadResponse(BaseModel):
    message: str
    total_products: int
    products_uploaded: int
    errors: List[str]
    batch_size: int
    estimated_time: str

@router.post("/bulk-upload", response_model=BulkUploadResponse)
async def bulk_upload_products(
    background_tasks: BackgroundTasks,
    admin_token: str = Depends(get_current_admin)
):
    """Bulk upload 10k products with optimized processing"""
    try:
        # Initialize services
        weaviate_service = WeaviateService()
        enrichment_service = EnrichmentService()
        
        # Check Weaviate connection
        if not await weaviate_service.check_connection():
            raise HTTPException(status_code=500, detail="Failed to connect to Weaviate")
        
        # Load the 10k products (Unsplash version)
        data_path = "/app/data/mock_storefront_data_10k_unsplash.json"
        try:
            with open(data_path, 'r') as f:
                products = json.load(f)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="10k products file not found")
        
        total_products = len(products)
        batch_size = 100  # Process in batches of 100
        success_count = 0
        errors = []
        
        # Process products in batches for better performance
        for i in range(0, total_products, batch_size):
            batch = products[i:i + batch_size]
            
            # Process batch concurrently
            batch_tasks = []
            for product in batch:
                task = process_single_product(product, enrichment_service, weaviate_service)
                batch_tasks.append(task)
            
            # Wait for batch to complete
            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
            
            # Count successes and errors
            for result in batch_results:
                if isinstance(result, Exception):
                    errors.append(str(result))
                elif result:
                    success_count += 1
                else:
                    errors.append("Unknown error processing product")
            
            # Log progress
            print(f"Processed batch {i//batch_size + 1}/{(total_products + batch_size - 1)//batch_size}")
        
        # Close Weaviate connection
        weaviate_service.close()
        
        estimated_time = f"~{total_products//1000} minutes" if total_products > 1000 else "~30 seconds"
        
        return BulkUploadResponse(
            message=f"Bulk upload completed: {success_count}/{total_products} products uploaded",
            total_products=total_products,
            products_uploaded=success_count,
            errors=errors[:10],  # Limit error list
            batch_size=batch_size,
            estimated_time=estimated_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_single_product(product: Dict[str, Any], enrichment_service, weaviate_service) -> bool:
    """Process a single product with enrichment and upload"""
    try:
        # Enrich product with AI
        enriched_product = await enrichment_service.enrich_product(product)
        
        # Upload to Weaviate
        success = await weaviate_service.add_product(enriched_product)
        return success
        
    except Exception as e:
        print(f"Error processing product {product.get('id', 'unknown')}: {str(e)}")
        return False

@router.get("/bulk-status")
async def get_bulk_upload_status(admin_token: str = Depends(get_current_admin)):
    """Get current status of bulk upload"""
    try:
        weaviate_service = WeaviateService()
        
        if not await weaviate_service.check_connection():
            raise HTTPException(status_code=500, detail="Failed to connect to Weaviate")
        
        # Get total products in Weaviate
        products = await weaviate_service.get_all_products(limit=10000)
        total_in_weaviate = len(products)
        
        weaviate_service.close()
        
        return {
            "total_products_in_weaviate": total_in_weaviate,
            "status": "ready" if total_in_weaviate > 0 else "empty",
            "last_updated": "now"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
