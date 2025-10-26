#!/usr/bin/env python3
"""
Script to fix image URLs in the dataset to use proper Unsplash format
"""

import json
import random
from pathlib import Path

def fix_image_urls():
    """Fix image URLs to use proper Unsplash format"""
    
    # Load the current dataset
    data_path = Path(__file__).parent.parent / "data" / "mock_storefront_data_10k_unsplash.json"
    
    print(f"Loading data from {data_path}")
    with open(data_path, 'r') as f:
        products = json.load(f)
    
    print(f"Loaded {len(products)} products")
    
    # Fix each product's image URL
    for i, product in enumerate(products):
        # Generate a proper Unsplash image URL with the format you specified
        photo_id = random.randint(1000000000, 9999999999)
        
        # Use the exact format you specified
        image_url = f"https://images.unsplash.com/photo-{photo_id}?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900"
        
        product["image_url"] = image_url
        
        if (i + 1) % 1000 == 0:
            print(f"Fixed {i + 1} products...")
    
    # Save the fixed data
    output_path = Path(__file__).parent.parent / "data" / "mock_storefront_data_10k_unsplash.json"
    with open(output_path, 'w') as f:
        json.dump(products, f, indent=2)
    
    print(f"Fixed image URLs saved to {output_path}")
    
    # Also update the sample file
    sample_products = products[:100]
    sample_path = Path(__file__).parent.parent / "data" / "sample_products.json"
    with open(sample_path, 'w') as f:
        json.dump(sample_products, f, indent=2)
    
    print(f"Sample data updated at {sample_path}")
    
    # Show a few examples
    print("\nExample image URLs:")
    for i in range(5):
        print(f"  {products[i]['title']}: {products[i]['image_url']}")

if __name__ == "__main__":
    fix_image_urls()
