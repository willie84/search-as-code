#!/usr/bin/env python3
"""
Script to convert sample_products.json to CSV format for admin upload
"""

import json
import csv
from pathlib import Path

def convert_json_to_csv():
    """Convert sample_products.json to CSV format"""
    print("🔄 Converting sample_products.json to CSV format...")
    
    # Load JSON data
    json_path = Path(__file__).parent.parent / "data" / "sample_products.json"
    csv_path = Path(__file__).parent.parent / "data" / "sample_products.csv"
    
    with open(json_path, 'r') as f:
        products = json.load(f)
    
    print(f"Loaded {len(products)} products from {json_path}")
    
    # Write to CSV
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        if products:
            # Get fieldnames from first product
            fieldnames = list(products[0].keys())
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            
            # Write header
            writer.writeheader()
            
            # Write products
            for product in products:
                writer.writerow(product)
    
    print(f"✅ Created CSV file: {csv_path}")
    print(f"📊 CSV contains {len(products)} products")
    
    # Show sample of first product
    if products:
        print("\n📦 Sample product structure:")
        for key, value in products[0].items():
            print(f"   {key}: {value}")

if __name__ == "__main__":
    convert_json_to_csv()
