import asyncio
import json
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Add the parent directory to the path so we can import our services
sys.path.append(str(Path(__file__).parent.parent))

from services.weaviate_service import WeaviateService
from services.enrichment_service import EnrichmentService

#from services.weaviate_service import WeaviateService
#from services.config_manager import ConfigManager
#from services.enrichment_service import EnrichmentService
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def load_sample_data():
    """Load sample products from JSON file"""
    data_path = Path(__file__).parent.parent / "data" / "sample_products.json"
    try:
        with open(data_path, 'r') as f:
            products = json.load(f)
        logger.info(f"Loaded {len(products)} products from {data_path}")
        return products
    except FileNotFoundError:
        logger.error(f"Sample data file not found: {data_path}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing JSON: {e}")
        return []

async def main():
    """Main function to load and enrich sample data"""
    try:
        # Initialize services
        weaviate_service = WeaviateService()
        enrichment_service = EnrichmentService()
        
        # Check Weaviate connection
        logger.info("Checking Weaviate connection...")
        if not await weaviate_service.check_connection():
            logger.error("Failed to connect to Weaviate. Make sure it's running.")
            return
        
        # Check if data already exists to prevent reloading
        existing_products = await weaviate_service.get_all_products()
        if len(existing_products) > 0:
            logger.info(f"Data already exists in Weaviate ({len(existing_products)} products). Skipping data loading.")
            return
        
        # Delete existing collection to start fresh
        logger.info("Deleting existing collection if it exists...")
        # await weaviate_service.delete_collection()  # Commented out to prevent reloading items
        
        # Create schema if it doesn't exist
        logger.info("Creating Weaviate schema...")
        await weaviate_service.create_schema()
        
        # Load sample data
        products = await load_sample_data()
        if not products:
            logger.error("No products to process")
            return
        
        # Process each product
        success_count = 0
        for i, product in enumerate(products, 1):
            try:
                logger.info(f"Processing product {i}/{len(products)}: {product.get('title', 'Unknown')}")
                
                # Enrich product with AI
                enriched_product = await enrichment_service.enrich_product(product)
                
                # Upload to Weaviate
                success = await weaviate_service.add_product(enriched_product)
                
                if success:
                    success_count += 1
                    logger.info(f"✅ Successfully uploaded product {product.get('id', i)}")
                else:
                    logger.error(f"❌ Failed to upload product {product.get('id', i)}")
                    
            except Exception as e:
                logger.error(f"❌ Error processing product {product.get('id', i)}: {str(e)}")
        
        logger.info(f"Completed: {success_count}/{len(products)} products uploaded successfully")
        
        # Close connections
        weaviate_service.close()
        
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")

if __name__ == "__main__":
    # Check if required environment variables are set
    if not os.getenv("OPENAI_API_KEY"):
        logger.warning("OPENAI_API_KEY not set. Enrichment will be limited to basic keyword extraction.")
    
    # Run the async main function
    asyncio.run(main())