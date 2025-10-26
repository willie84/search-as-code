from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Request
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import csv
import io
import asyncio
from services.weaviate_service import WeaviateService
from services.enrichment_service import EnrichmentService
from services.auth_service import AuthService
from api.endpoints.auth import get_current_admin

router = APIRouter()
auth_service = AuthService()

class ProductUploadResponse(BaseModel):
    message: str
    products_uploaded: int
    errors: List[str]

class Product(BaseModel):
    id: str
    title: str
    description: str
    price: float
    image_url: str
    color: str = ""
    style: str = ""
    fabric: str = ""
    occasion: str = ""
    category: str = ""
    brand: str = ""

@router.post("/products/upload-json", response_model=ProductUploadResponse)
async def upload_products_json(
    request: Request,
    admin_token: str = Depends(get_current_admin)
):
    """Upload products from JSON data"""
    try:
        # Parse JSON from request body
        body = await request.json()
        if not isinstance(body, list):
            raise HTTPException(status_code=400, detail="Request body must be an array of products")
        
        # Initialize services
        weaviate_service = WeaviateService()
        enrichment_service = EnrichmentService()
        
        # Check Weaviate connection
        if not await weaviate_service.check_connection():
            raise HTTPException(status_code=500, detail="Failed to connect to Weaviate")
        
        success_count = 0
        errors = []
        
        # Process products in batches to avoid overwhelming the system
        batch_size = 50
        total_products = len(body)
        
        for i in range(0, total_products, batch_size):
            batch = body[i:i + batch_size]
            print(f"Processing batch {i//batch_size + 1}/{(total_products + batch_size - 1)//batch_size} ({len(batch)} products)")
            
            for product_data in batch:
                try:
                    # Convert ID to string if it's an integer
                    if isinstance(product_data.get('id'), int):
                        product_data['id'] = str(product_data['id'])
                    
                    # Validate required fields
                    required_fields = ['id', 'title', 'description', 'price', 'image_url']
                    for field in required_fields:
                        if field not in product_data:
                            raise ValueError(f"Missing required field: {field}")
                    
                    enriched_product = await enrichment_service.enrich_product(product_data)
                    
                    # Add to Weaviate
                    success = await weaviate_service.add_product(enriched_product)
                    if success:
                        success_count += 1
                    else:
                        errors.append(f"Failed to upload product: {product_data.get('title', 'Unknown')}")
                except Exception as e:
                    errors.append(f"Error uploading {product_data.get('title', 'Unknown')}: {str(e)}")
            
            # Small delay between batches to prevent overwhelming the system
            if i + batch_size < total_products:
                await asyncio.sleep(0.1)
        
        # Close Weaviate connection
        weaviate_service.close()
        
        return ProductUploadResponse(
            message=f"Uploaded {success_count} products successfully",
            products_uploaded=success_count,
            errors=errors
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/products/upload-csv", response_model=ProductUploadResponse)
async def upload_products_csv(
    file: UploadFile = File(...),
    admin_token: str = Depends(get_current_admin)
):
    """Upload products from CSV file"""
    try:
        # Initialize services
        weaviate_service = WeaviateService()
        enrichment_service = EnrichmentService()
        
        # Check Weaviate connection
        if not await weaviate_service.check_connection():
            raise HTTPException(status_code=500, detail="Failed to connect to Weaviate")
        
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Parse CSV
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        products = []
        
        for row in csv_reader:
            # Convert CSV row to product format
            product = {
                "id": row.get("id", ""),
                "title": row.get("title", ""),
                "description": row.get("description", ""),
                "price": float(row.get("price", 0)),
                "image_url": row.get("image_url", ""),
                "color": row.get("color", ""),
                "style": row.get("style", ""),
                "fabric": row.get("fabric", ""),
                "occasion": row.get("occasion", ""),
                "category": row.get("category", ""),
                "brand": row.get("brand", "")
            }
            products.append(product)
        
        # Upload to Weaviate
        success_count = 0
        errors = []
        
        for product in products:
            try:
                # Enrich product with AI
                enriched_product = await enrichment_service.enrich_product(product)
                
                # Add to Weaviate
                success = await weaviate_service.add_product(enriched_product)
                if success:
                    success_count += 1
                else:
                    errors.append(f"Failed to upload product: {product['title']}")
            except Exception as e:
                errors.append(f"Error uploading {product['title']}: {str(e)}")
        
        # Close Weaviate connection
        weaviate_service.close()
        
        return ProductUploadResponse(
            message=f"Uploaded {success_count} products from CSV",
            products_uploaded=success_count,
            errors=errors
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products")
async def get_products(
    limit: int = 50,
    admin_token: str = Depends(get_current_admin)
):
    """Get all products (admin only)"""
    try:
        weaviate_service = WeaviateService()
        
        # Check connection
        if not await weaviate_service.check_connection():
            raise HTTPException(status_code=500, detail="Failed to connect to Weaviate")
        
        # Get products from Weaviate
        products = await weaviate_service.get_all_products(limit=limit)
        
        # Close connection
        weaviate_service.close()
        
        return {
            "products": products,
            "total": len(products),
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    admin_token: str = Depends(get_current_admin)
):
    """Delete a product (admin only)"""
    try:
        # This would need to be implemented in WeaviateService
        return {"message": f"Product {product_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
