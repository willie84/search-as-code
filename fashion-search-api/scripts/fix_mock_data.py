#!/usr/bin/env python3
"""
Script to fix the mock storefront data with proper categories and realistic image URLs
"""

import json
import random
from pathlib import Path

# Define proper product categories with realistic data
PRODUCT_CATEGORIES = {
    "Clothing": {
        "products": [
            {"title": "Classic White T-Shirt", "description": "100% cotton t-shirt, perfect for everyday wear", "price_range": (15, 35)},
            {"title": "Blue Denim Jacket", "description": "Vintage-style denim jacket with modern fit", "price_range": (45, 85)},
            {"title": "Black Leather Jacket", "description": "Premium leather jacket with classic styling", "price_range": (120, 250)},
            {"title": "Wool Scarf", "description": "Soft wool scarf in various colors", "price_range": (25, 55)},
            {"title": "Running Shoes", "description": "Comfortable athletic shoes for running and training", "price_range": (60, 150)},
            {"title": "Casual Sneakers", "description": "Versatile sneakers for everyday comfort", "price_range": (40, 100)},
            {"title": "Dress Shirt", "description": "Professional dress shirt in various colors", "price_range": (30, 70)},
            {"title": "Summer Dress", "description": "Light and breezy summer dress", "price_range": (35, 80)},
            {"title": "Winter Coat", "description": "Warm winter coat for cold weather", "price_range": (80, 180)},
            {"title": "Jeans", "description": "Classic denim jeans in various fits", "price_range": (40, 90)}
        ],
        "images": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&fm=jpg&w=800&fit=max",  # T-shirt
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&fm=jpg&w=800&fit=max",  # Denim jacket
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&fm=jpg&w=800&fit=max",  # Leather jacket
            "https://images.unsplash.com/photo-1601925260369-1b1b0b0b0b0b?q=80&fm=jpg&w=800&fit=max",  # Scarf
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&fm=jpg&w=800&fit=max",  # Running shoes
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&fm=jpg&w=800&fit=max",  # Sneakers
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&fm=jpg&w=800&fit=max",  # Dress shirt
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&fm=jpg&w=800&fit=max",  # Summer dress
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&fm=jpg&w=800&fit=max",  # Winter coat
            "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&fm=jpg&w=800&fit=max"   # Jeans
        ]
    },
    "Groceries": {
        "products": [
            {"title": "Organic Apples", "description": "Fresh organic apples from local farms", "price_range": (3, 8)},
            {"title": "Whole Wheat Bread", "description": "Artisanal whole wheat bread baked daily", "price_range": (2, 5)},
            {"title": "Organic Milk", "description": "Fresh organic milk from grass-fed cows", "price_range": (2, 4)},
            {"title": "Free Range Eggs", "description": "Farm-fresh eggs from free-range chickens", "price_range": (4, 7)},
            {"title": "Organic Spinach", "description": "Fresh organic spinach leaves", "price_range": (2, 5)},
            {"title": "Greek Yogurt", "description": "Creamy Greek yogurt with live cultures", "price_range": (3, 6)},
            {"title": "Almond Butter", "description": "Natural almond butter, no added sugar", "price_range": (6, 12)},
            {"title": "Quinoa", "description": "Organic quinoa, perfect for healthy meals", "price_range": (4, 8)},
            {"title": "Avocados", "description": "Fresh ripe avocados, perfect for salads", "price_range": (2, 4)},
            {"title": "Salmon Fillet", "description": "Fresh Atlantic salmon fillet", "price_range": (12, 20)}
        ],
        "images": [
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&fm=jpg&w=800&fit=max",  # Apples
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&fm=jpg&w=800&fit=max",  # Bread
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&fm=jpg&w=800&fit=max",  # Milk
            "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?q=80&fm=jpg&w=800&fit=max",  # Eggs
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&fm=jpg&w=800&fit=max",  # Spinach
            "https://images.unsplash.com/photo-1571212058254-8c75d0b4c8b2?q=80&fm=jpg&w=800&fit=max",  # Yogurt
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&fm=jpg&w=800&fit=max",  # Almond butter
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&fm=jpg&w=800&fit=max",  # Quinoa
            "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&fm=jpg&w=800&fit=max",  # Avocados
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&fm=jpg&w=800&fit=max"   # Salmon
        ]
    },
    "Furniture": {
        "products": [
            {"title": "Ergonomic Office Chair", "description": "Comfortable office chair with lumbar support", "price_range": (150, 300)},
            {"title": "Dining Chair Set", "description": "Set of 4 modern dining chairs", "price_range": (200, 400)},
            {"title": "Coffee Table", "description": "Modern coffee table with storage", "price_range": (100, 250)},
            {"title": "Bookshelf", "description": "5-tier wooden bookshelf", "price_range": (80, 180)},
            {"title": "Sofa", "description": "3-seater comfortable sofa", "price_range": (400, 800)},
            {"title": "Bed Frame", "description": "Queen size wooden bed frame", "price_range": (200, 500)},
            {"title": "Dining Table", "description": "6-person wooden dining table", "price_range": (300, 600)},
            {"title": "Desk", "description": "Modern office desk with drawers", "price_range": (150, 350)},
            {"title": "Wardrobe", "description": "Large wooden wardrobe with mirror", "price_range": (300, 600)},
            {"title": "Nightstand", "description": "Wooden nightstand with drawer", "price_range": (60, 120)}
        ],
        "images": [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&fm=jpg&w=800&fit=max",  # Office chair
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&fm=jpg&w=800&fit=max",  # Dining chairs
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&fm=jpg&w=800&fit=max",  # Coffee table
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&fm=jpg&w=800&fit=max",  # Bookshelf
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&fm=jpg&w=800&fit=max",  # Sofa
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&fm=jpg&w=800&fit=max",  # Bed frame
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&fm=jpg&w=800&fit=max",  # Dining table
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&fm=jpg&w=800&fit=max",  # Desk
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&fm=jpg&w=800&fit=max",  # Wardrobe
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&fm=jpg&w=800&fit=max"   # Nightstand
        ]
    },
    "Electronics": {
        "products": [
            {"title": "Bluetooth Speaker", "description": "Portable wireless speaker with great sound", "price_range": (30, 80)},
            {"title": "Wireless Headphones", "description": "Noise-cancelling wireless headphones", "price_range": (80, 200)},
            {"title": "Smartphone", "description": "Latest model smartphone with advanced features", "price_range": (300, 800)},
            {"title": "Laptop", "description": "High-performance laptop for work and gaming", "price_range": (500, 1500)},
            {"title": "Tablet", "description": "10-inch tablet with high-resolution display", "price_range": (200, 500)},
            {"title": "Smart Watch", "description": "Fitness tracking smartwatch with health monitoring", "price_range": (150, 400)},
            {"title": "Gaming Console", "description": "Latest gaming console with 4K support", "price_range": (300, 500)},
            {"title": "Camera", "description": "Digital camera with professional features", "price_range": (400, 1000)},
            {"title": "Monitor", "description": "27-inch 4K monitor for work and entertainment", "price_range": (200, 500)},
            {"title": "Router", "description": "High-speed WiFi router with mesh technology", "price_range": (80, 200)}
        ],
        "images": [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&fm=jpg&w=800&fit=max",  # Bluetooth speaker
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&fm=jpg&w=800&fit=max",  # Headphones
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&fm=jpg&w=800&fit=max",  # Smartphone
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&fm=jpg&w=800&fit=max",  # Laptop
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&fm=jpg&w=800&fit=max",  # Tablet
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&fm=jpg&w=800&fit=max",  # Smart watch
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&fm=jpg&w=800&fit=max",  # Gaming console
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&fm=jpg&w=800&fit=max",  # Camera
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&fm=jpg&w=800&fit=max",  # Monitor
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&fm=jpg&w=800&fit=max"   # Router
        ]
    }
}

def fix_mock_data():
    """Fix the mock data with proper categories and realistic images"""
    
    # Load the original data
    data_path = Path(__file__).parent.parent / "data" / "mock_storefront_data_10k.json"
    
    print(f"Loading data from {data_path}")
    with open(data_path, 'r') as f:
        products = json.load(f)
    
    print(f"Loaded {len(products)} products")
    
    # Fix each product
    fixed_products = []
    category_counts = {"Clothing": 0, "Groceries": 0, "Furniture": 0, "Electronics": 0}
    
    for i, product in enumerate(products):
        # Determine category based on product title
        title = product.get("title", "").lower()
        category = None
        
        # Simple keyword matching to assign proper categories
        if any(keyword in title for keyword in ["shirt", "jacket", "scarf", "shoes", "sneakers", "dress", "coat", "jeans", "t-shirt"]):
            category = "Clothing"
        elif any(keyword in title for keyword in ["apple", "bread", "milk", "egg", "spinach", "yogurt", "almond", "quinoa", "avocado", "salmon"]):
            category = "Groceries"
        elif any(keyword in title for keyword in ["chair", "table", "sofa", "bed", "desk", "wardrobe", "nightstand", "bookshelf", "coffee"]):
            category = "Furniture"
        elif any(keyword in title for keyword in ["speaker", "headphone", "phone", "laptop", "tablet", "watch", "console", "camera", "monitor", "router", "bluetooth", "wireless", "smart"]):
            category = "Electronics"
        else:
            # Random assignment if no keywords match
            category = random.choice(list(PRODUCT_CATEGORIES.keys()))
        
        # Get product template from the category
        category_data = PRODUCT_CATEGORIES[category]
        product_template = random.choice(category_data["products"])
        
        # Generate realistic price within the range
        min_price, max_price = product_template["price_range"]
        price = round(random.uniform(min_price, max_price), 2)
        
        # Get appropriate image
        image_url = random.choice(category_data["images"])
        
        # Create fixed product
        fixed_product = {
            "id": product.get("id", i + 1),
            "title": product_template["title"],
            "description": product_template["description"],
            "category": category,
            "price": price,
            "image_url": image_url
        }
        
        fixed_products.append(fixed_product)
        category_counts[category] += 1
        
        if (i + 1) % 1000 == 0:
            print(f"Processed {i + 1} products...")
    
    # Save the fixed data
    output_path = Path(__file__).parent.parent / "data" / "mock_storefront_data_10k_fixed.json"
    with open(output_path, 'w') as f:
        json.dump(fixed_products, f, indent=2)
    
    print(f"\nFixed data saved to {output_path}")
    print(f"Category distribution:")
    for category, count in category_counts.items():
        print(f"  {category}: {count} products")
    
    # Also create a smaller sample for testing
    sample_products = fixed_products[:100]
    sample_path = Path(__file__).parent.parent / "data" / "sample_products_fixed.json"
    with open(sample_path, 'w') as f:
        json.dump(sample_products, f, indent=2)
    
    print(f"Sample data (100 products) saved to {sample_path}")

if __name__ == "__main__":
    fix_mock_data()
