#!/usr/bin/env python3
"""
Test script to demonstrate the enhanced AI-powered enrichment
"""

import asyncio
import json
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our services
sys.path.append(str(Path(__file__).parent.parent))

from services.enrichment_service import EnrichmentService

async def test_enrichment():
    """Test the enhanced enrichment service"""
    print("🧪 Testing Enhanced AI-Powered Enrichment")
    print("=" * 60)
    
    # Initialize enrichment service
    enrichment_service = EnrichmentService()
    
    # Test products with different categories
    test_products = [
        {
            "id": "test_1",
            "title": "Classic White Cotton T-Shirt",
            "description": "Comfortable everyday t-shirt made from 100% organic cotton. Perfect for casual wear and layering.",
            "category": "Clothing",
            "price": 24.99,
            "image_url": "https://example.com/tshirt.jpg"
        },
        {
            "id": "test_2", 
            "title": "Organic Apples - Fresh from Local Farm",
            "description": "Crisp, sweet organic apples grown sustainably without pesticides. Great for snacking or baking.",
            "category": "Groceries",
            "price": 4.99,
            "image_url": "https://example.com/apples.jpg"
        },
        {
            "id": "test_3",
            "title": "Ergonomic Office Chair - Black Leather",
            "description": "Professional office chair with lumbar support and adjustable height. Perfect for long work sessions.",
            "category": "Furniture", 
            "price": 299.99,
            "image_url": "https://example.com/chair.jpg"
        },
        {
            "id": "test_4",
            "title": "Wireless Bluetooth Headphones - Noise Cancelling",
            "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
            "category": "Electronics",
            "price": 199.99,
            "image_url": "https://example.com/headphones.jpg"
        }
    ]
    
    print(f"Testing enrichment on {len(test_products)} products...")
    print()
    
    for i, product in enumerate(test_products, 1):
        print(f"📦 Product {i}: {product['title']}")
        print(f"   Category: {product['category']}")
        print(f"   Description: {product['description'][:80]}...")
        
        # Enrich the product
        enriched = await enrichment_service.enrich_product(product)
        
        print(f"   🎯 Enriched Attributes:")
        print(f"      Color: {enriched.get('color', 'N/A')}")
        print(f"      Style: {enriched.get('style', 'N/A')}")
        print(f"      Fabric: {enriched.get('fabric', 'N/A')}")
        print(f"      Occasion: {enriched.get('occasion', 'N/A')}")
        print(f"      Season: {enriched.get('season', 'N/A')}")
        print(f"      Target Audience: {enriched.get('target_audience', 'N/A')}")
        print(f"      Sustainability: {enriched.get('sustainability', 'N/A')}")
        print(f"      Tags: {enriched.get('tags', [])}")
        print(f"      Search Keywords: {enriched.get('search_keywords', [])}")
        print()
    
    print("✅ Enrichment test completed!")
    print("=" * 60)
    print("🔍 Key Features Demonstrated:")
    print("   • AI-powered attribute extraction (if OpenAI API key is set)")
    print("   • Enhanced keyword matching with comprehensive vocabularies")
    print("   • Multi-category support (Clothing, Groceries, Furniture, Electronics)")
    print("   • Rich metadata for improved search and filtering")
    print("   • Fallback to keyword extraction when AI is unavailable")
    print()
    print("🚀 Ready for robust search with enriched product data!")

if __name__ == "__main__":
    asyncio.run(test_enrichment())
