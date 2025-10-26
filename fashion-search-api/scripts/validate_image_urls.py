#!/usr/bin/env python3
"""
Script to validate image URLs and remove any that return 404 errors
"""

import json
import asyncio
import aiohttp
from pathlib import Path
from typing import List, Dict, Any
import time

async def check_image_url(session: aiohttp.ClientSession, url: str) -> bool:
    """
    Check if an image URL is accessible (returns 200)
    """
    try:
        async with session.head(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
            return response.status == 200
    except Exception as e:
        print(f"    Error checking {url}: {e}")
        return False

async def validate_products(products: List[Dict[str, Any]], batch_size: int = 50) -> List[Dict[str, Any]]:
    """
    Validate all product image URLs and return only valid products
    """
    valid_products = []
    total_products = len(products)
    
    print(f"Validating {total_products} product image URLs...")
    
    # Create semaphore to limit concurrent requests
    semaphore = asyncio.Semaphore(batch_size)
    
    async def validate_single_product(session: aiohttp.ClientSession, product: Dict[str, Any]) -> Dict[str, Any]:
        async with semaphore:
            is_valid = await check_image_url(session, product["image_url"])
            if is_valid:
                return product
            else:
                print(f"  ❌ Invalid image: {product['title']} - {product['image_url']}")
                return None
    
    # Process products in batches
    async with aiohttp.ClientSession() as session:
        for i in range(0, total_products, batch_size):
            batch = products[i:i + batch_size]
            print(f"  Processing batch {i//batch_size + 1}/{(total_products + batch_size - 1)//batch_size}...")
            
            # Validate batch concurrently
            tasks = [validate_single_product(session, product) for product in batch]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Add valid products to the list
            for result in results:
                if isinstance(result, dict) and result is not None:
                    valid_products.append(result)
                elif isinstance(result, Exception):
                    print(f"    Exception: {result}")
            
            # Rate limiting between batches
            if i + batch_size < total_products:
                await asyncio.sleep(1)
    
    return valid_products

def save_validated_products(valid_products: List[Dict[str, Any]], original_count: int):
    """
    Save validated products to JSON files
    """
    # Update product IDs to be sequential
    for i, product in enumerate(valid_products):
        product["id"] = i + 1
    
    # Save full dataset
    output_path = Path(__file__).parent.parent / "data" / "mock_storefront_data_10k_validated.json"
    with open(output_path, 'w') as f:
        json.dump(valid_products, f, indent=2)
    
    print(f"Saved {len(valid_products)} valid products to {output_path}")
    
    # Save sample dataset
    sample_products = valid_products[:100]
    sample_path = Path(__file__).parent.parent / "data" / "sample_products_validated.json"
    with open(sample_path, 'w') as f:
        json.dump(sample_products, f, indent=2)
    
    print(f"Saved {len(sample_products)} sample products to {sample_path}")
    
    # Print statistics
    removed_count = original_count - len(valid_products)
    print(f"\n📊 Validation Results:")
    print(f"  Original products: {original_count}")
    print(f"  Valid products: {len(valid_products)}")
    print(f"  Removed (404s): {removed_count}")
    print(f"  Success rate: {(len(valid_products)/original_count)*100:.1f}%")
    
    # Print category distribution
    category_counts = {}
    for product in valid_products:
        category = product["category"]
        category_counts[category] = category_counts.get(category, 0) + 1
    
    print(f"\nCategory distribution after validation:")
    for category, count in category_counts.items():
        print(f"  {category}: {count} products")

async def main():
    """
    Main function to validate image URLs
    """
    print("🔍 Validating image URLs in the dataset...")
    print("=" * 60)
    
    # Load the current dataset
    data_path = Path(__file__).parent.parent / "data" / "mock_storefront_data_10k_unsplash.json"
    
    print(f"Loading data from {data_path}")
    with open(data_path, 'r') as f:
        products = json.load(f)
    
    original_count = len(products)
    print(f"Loaded {original_count} products")
    
    # Validate products
    start_time = time.time()
    valid_products = await validate_products(products)
    end_time = time.time()
    
    print(f"\n⏱️  Validation completed in {end_time - start_time:.1f} seconds")
    
    # Save validated products
    save_validated_products(valid_products, original_count)
    
    print("\n✅ Image URL validation complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
