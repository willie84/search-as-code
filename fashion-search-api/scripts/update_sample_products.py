#!/usr/bin/env python3
"""
Script to update sample_products.json with enhanced enriched structure
"""

import json
import asyncio
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our services
sys.path.append(str(Path(__file__).parent.parent))

from services.enrichment_service import EnrichmentService

async def update_sample_products():
    """Update sample products with enriched structure"""
    print("🔄 Updating sample_products.json with enhanced enrichment...")
    
    # Load current sample products
    sample_path = Path(__file__).parent.parent / "data" / "sample_products.json"
    
    with open(sample_path, 'r') as f:
        products = json.load(f)
    
    print(f"Loaded {len(products)} products from sample_products.json")
    
    # Initialize enrichment service
    enrichment_service = EnrichmentService()
    
    # Enrich each product
    enriched_products = []
    for i, product in enumerate(products, 1):
        print(f"Enriching product {i}/{len(products)}: {product.get('title', 'Unknown')}")
        
        # Enrich the product
        enriched = await enrichment_service.enrich_product(product)
        enriched_products.append(enriched)
    
    # Save enriched products
    with open(sample_path, 'w') as f:
        json.dump(enriched_products, f, indent=2)
    
    print(f"✅ Updated {len(enriched_products)} products with enhanced enrichment")
    
    # Show sample of enriched product
    if enriched_products:
        sample = enriched_products[0]
        print("\n📦 Sample enriched product:")
        print(f"   Title: {sample.get('title')}")
        print(f"   Category: {sample.get('category')}")
        print(f"   Color: {sample.get('color', 'N/A')}")
        print(f"   Style: {sample.get('style', 'N/A')}")
        print(f"   Fabric: {sample.get('fabric', 'N/A')}")
        print(f"   Occasion: {sample.get('occasion', 'N/A')}")
        print(f"   Season: {sample.get('season', 'N/A')}")
        print(f"   Target Audience: {sample.get('target_audience', 'N/A')}")
        print(f"   Sustainability: {sample.get('sustainability', 'N/A')}")
        print(f"   Tags: {sample.get('tags', [])}")
        print(f"   Search Keywords: {sample.get('search_keywords', [])}")
    
    print("\n🎯 Sample products are now ready for frontend display!")

if __name__ == "__main__":
    asyncio.run(update_sample_products())
