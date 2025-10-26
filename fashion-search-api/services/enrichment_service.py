from typing import List, Dict, Any, Optional
import os
import logging
import asyncio
import aiohttp
import json
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class EnrichmentService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = None
        
        if self.api_key:
            self.openai_client = AsyncOpenAI(api_key=self.api_key)
            logger.info("OpenAI client initialized for AI enrichment")
        else:
            logger.warning("OPENAI_API_KEY not set. Using basic keyword extraction only.")
    
    async def enrich_product(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich a product with AI-powered attribute extraction"""
        try:
            # Use AI enrichment if available, otherwise fall back to keyword extraction
            if self.openai_client:
                ai_attributes = await self.extract_attributes_with_ai(
                    product.get('title', ''),
                    product.get('description', ''),
                    product.get('category', '')
                )
            else:
                ai_attributes = {}
            
            # Fallback to keyword extraction for any missing attributes
            keyword_attributes = self.extract_text_attributes(
                product.get('title', ''),
                product.get('description', '')
            )
            
            # Merge AI and keyword attributes (AI takes precedence)
            merged_attributes = {**keyword_attributes, **ai_attributes}
            
            enriched_product = {
                'id': product.get('id'),
                'title': product.get('title', ''),
                'description': product.get('description', ''),
                'price': product.get('price', 0),
                'image_url': product.get('image_url', ''),
                'color': product.get('color') or merged_attributes.get('color', ''),
                'style': product.get('style') or merged_attributes.get('style', ''),
                'fabric': product.get('fabric') or merged_attributes.get('fabric', ''),
                'occasion': product.get('occasion') or merged_attributes.get('occasion', ''),
                'category': product.get('category', ''),
                'brand': product.get('brand', ''),
                'season': merged_attributes.get('season', ''),
                'size_range': merged_attributes.get('size_range', ''),
                'target_audience': merged_attributes.get('target_audience', ''),
                'care_instructions': merged_attributes.get('care_instructions', ''),
                'sustainability': merged_attributes.get('sustainability', ''),
                'tags': merged_attributes.get('tags', []),
                'search_keywords': merged_attributes.get('search_keywords', [])
            }
            
            return enriched_product
            
        except Exception as e:
            logger.error(f"Error in AI enrichment: {e}")
            # Fallback to basic enrichment
            return await self._basic_enrichment(product)
    
    async def extract_attributes_with_ai(self, title: str, description: str, category: str) -> Dict[str, Any]:
        """Extract product attributes using OpenAI API"""
        try:
            prompt = f"""
            Analyze this product and extract detailed attributes for e-commerce search optimization.
            
            Product Title: {title}
            Description: {description}
            Category: {category}
            
            Extract and return ONLY a JSON object with these fields:
            {{
                "color": "primary color (e.g., navy, burgundy, charcoal)",
                "style": "style descriptor (e.g., minimalist, bohemian, preppy, edgy)",
                "fabric": "material type (e.g., organic cotton, cashmere, denim, silk)",
                "occasion": "best use case (e.g., work, casual, formal, athletic, party)",
                "season": "seasonal appropriateness (e.g., spring, summer, fall, winter, all-season)",
                "size_range": "size category (e.g., plus-size, petite, regular, unisex)",
                "target_audience": "demographic (e.g., women, men, children, unisex, professional)",
                "care_instructions": "care requirements (e.g., machine-washable, dry-clean-only, hand-wash)",
                "sustainability": "eco-friendly features (e.g., organic, recycled, sustainable, fair-trade)",
                "tags": ["array", "of", "relevant", "search", "tags"],
                "search_keywords": ["array", "of", "additional", "keywords", "for", "search"]
            }}
            
            Rules:
            - Return ONLY valid JSON, no other text
            - Use empty string "" for unknown values
            - Use empty array [] for unknown arrays
            - Be specific and descriptive
            - Focus on searchable attributes that improve product discoverability
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert e-commerce product analyst. Extract detailed attributes from product information to improve search and discovery."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            # Parse the JSON response
            content = response.choices[0].message.content.strip()
            
            # Clean up the response (remove any markdown formatting)
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            attributes = json.loads(content)
            logger.debug(f"AI extracted attributes: {attributes}")
            return attributes
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            return {}
        except Exception as e:
            logger.error(f"Error in AI attribute extraction: {e}")
            return {}
    
    async def _basic_enrichment(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback basic enrichment without AI"""
        text_attributes = self.extract_text_attributes(
            product.get('title', ''),
            product.get('description', '')
        )
        
        return {
            'id': product.get('id'),
            'title': product.get('title', ''),
            'description': product.get('description', ''),
            'price': product.get('price', 0),
            'image_url': product.get('image_url', ''),
            'color': product.get('color') or text_attributes.get('color', ''),
            'style': product.get('style') or text_attributes.get('style', ''),
            'fabric': product.get('fabric') or text_attributes.get('fabric', ''),
            'occasion': product.get('occasion') or text_attributes.get('occasion', ''),
            'category': product.get('category', ''),
            'brand': product.get('brand', ''),
            'season': '',
            'size_range': '',
            'target_audience': '',
            'care_instructions': '',
            'sustainability': '',
            'tags': [],
            'search_keywords': []
        }

    def extract_text_attributes(self, title: str, description: str) -> Dict[str, Any]:
        """Extract attributes from product title and description using enhanced keyword matching"""
        combined_text = f"{title} {description}".lower()
        
        # Enhanced color extraction
        colors = {
            'red': ['red', 'crimson', 'burgundy', 'maroon', 'scarlet', 'cherry'],
            'blue': ['blue', 'navy', 'royal', 'sky', 'azure', 'cobalt', 'indigo'],
            'green': ['green', 'emerald', 'forest', 'mint', 'olive', 'sage', 'lime'],
            'yellow': ['yellow', 'gold', 'amber', 'mustard', 'lemon', 'cream'],
            'black': ['black', 'charcoal', 'ebony', 'onyx', 'jet'],
            'white': ['white', 'ivory', 'cream', 'pearl', 'snow', 'bone'],
            'gray': ['gray', 'grey', 'silver', 'ash', 'slate', 'pewter'],
            'brown': ['brown', 'tan', 'beige', 'khaki', 'camel', 'chocolate', 'coffee'],
            'pink': ['pink', 'rose', 'coral', 'salmon', 'blush', 'magenta'],
            'purple': ['purple', 'violet', 'lavender', 'plum', 'mauve', 'amethyst'],
            'orange': ['orange', 'peach', 'apricot', 'tangerine', 'rust', 'copper']
        }
        
        color = ''
        for color_name, variants in colors.items():
            if any(variant in combined_text for variant in variants):
                color = color_name
                break
        
        # Enhanced style extraction
        styles = {
            'casual': ['casual', 'relaxed', 'everyday', 'comfortable', 'laid-back'],
            'formal': ['formal', 'dressy', 'elegant', 'sophisticated', 'business'],
            'sporty': ['sporty', 'athletic', 'active', 'gym', 'workout', 'performance'],
            'vintage': ['vintage', 'retro', 'classic', 'antique', 'old-school'],
            'modern': ['modern', 'contemporary', 'trendy', 'fashionable', 'stylish'],
            'bohemian': ['bohemian', 'boho', 'hippie', 'artistic', 'free-spirited'],
            'minimalist': ['minimalist', 'simple', 'clean', 'basic', 'understated'],
            'preppy': ['preppy', 'prep', 'collegiate', 'traditional', 'polished']
        }
        
        style = ''
        for style_name, variants in styles.items():
            if any(variant in combined_text for variant in variants):
                style = style_name
                break
        
        # Enhanced fabric extraction
        fabrics = {
            'cotton': ['cotton', 'organic cotton', 'pima cotton', 'egyptian cotton'],
            'polyester': ['polyester', 'poly', 'poly-blend', 'synthetic'],
            'silk': ['silk', 'silk blend', 'mulberry silk', 'charmeuse'],
            'wool': ['wool', 'merino', 'cashmere', 'alpaca', 'angora'],
            'linen': ['linen', 'flax', 'linen blend'],
            'denim': ['denim', 'jean', 'jeans', 'stretch denim'],
            'leather': ['leather', 'genuine leather', 'suede', 'patent leather'],
            'knit': ['knit', 'jersey', 'fleece', 'sweater'],
            'blend': ['blend', 'mixed', 'combination']
        }
        
        fabric = ''
        for fabric_name, variants in fabrics.items():
            if any(variant in combined_text for variant in variants):
                fabric = fabric_name
                break
        
        # Enhanced occasion extraction
        occasions = {
            'work': ['work', 'office', 'business', 'professional', 'corporate'],
            'casual': ['casual', 'everyday', 'weekend', 'relaxed'],
            'formal': ['formal', 'dressy', 'elegant', 'evening', 'gala'],
            'party': ['party', 'celebration', 'festive', 'cocktail', 'night out'],
            'wedding': ['wedding', 'bridal', 'bridesmaid', 'ceremony'],
            'beach': ['beach', 'vacation', 'resort', 'tropical', 'summer'],
            'athletic': ['athletic', 'gym', 'workout', 'sports', 'fitness'],
            'outdoor': ['outdoor', 'hiking', 'camping', 'adventure', 'nature']
        }
        
        occasion = ''
        for occasion_name, variants in occasions.items():
            if any(variant in combined_text for variant in variants):
                occasion = occasion_name
                break
        
        # Extract additional attributes
        season = self._extract_season(combined_text)
        size_range = self._extract_size_range(combined_text)
        target_audience = self._extract_target_audience(combined_text)
        sustainability = self._extract_sustainability(combined_text)
        tags = self._extract_tags(combined_text)
        
        return {
            'color': color,
            'style': style,
            'fabric': fabric,
            'occasion': occasion,
            'season': season,
            'size_range': size_range,
            'target_audience': target_audience,
            'sustainability': sustainability,
            'tags': tags,
            'search_keywords': tags  # Use tags as search keywords for basic extraction
        }
    
    def _extract_season(self, text: str) -> str:
        """Extract seasonal information"""
        seasons = {
            'spring': ['spring', 'floral', 'light', 'pastel'],
            'summer': ['summer', 'lightweight', 'breathable', 'cool'],
            'fall': ['fall', 'autumn', 'layering', 'warm'],
            'winter': ['winter', 'warm', 'insulated', 'cozy', 'heavy'],
            'all-season': ['all-season', 'year-round', 'versatile']
        }
        
        for season, keywords in seasons.items():
            if any(keyword in text for keyword in keywords):
                return season
        return ''
    
    def _extract_size_range(self, text: str) -> str:
        """Extract size range information"""
        size_ranges = {
            'plus-size': ['plus-size', 'plus size', 'extended sizes', 'curvy'],
            'petite': ['petite', 'short', 'small frame'],
            'tall': ['tall', 'long', 'extended length'],
            'regular': ['regular', 'standard', 'normal'],
            'unisex': ['unisex', 'unisex', 'gender-neutral']
        }
        
        for size_range, keywords in size_ranges.items():
            if any(keyword in text for keyword in keywords):
                return size_range
        return ''
    
    def _extract_target_audience(self, text: str) -> str:
        """Extract target audience"""
        audiences = {
            'women': ['women', 'ladies', 'female', 'womens'],
            'men': ['men', 'mens', 'male', 'gentlemen'],
            'children': ['children', 'kids', 'child', 'youth', 'toddler'],
            'unisex': ['unisex', 'unisex', 'gender-neutral'],
            'professional': ['professional', 'business', 'corporate']
        }
        
        for audience, keywords in audiences.items():
            if any(keyword in text for keyword in keywords):
                return audience
        return ''
    
    def _extract_sustainability(self, text: str) -> str:
        """Extract sustainability information"""
        sustainability_keywords = {
            'organic': ['organic', 'eco-friendly', 'sustainable'],
            'recycled': ['recycled', 'upcycled', 'repurposed'],
            'fair-trade': ['fair-trade', 'fair trade', 'ethical'],
            'vegan': ['vegan', 'cruelty-free', 'plant-based']
        }
        
        for sustainability_type, keywords in sustainability_keywords.items():
            if any(keyword in text for keyword in keywords):
                return sustainability_type
        return ''
    
    def _extract_tags(self, text: str) -> List[str]:
        """Extract relevant tags from text"""
        tag_keywords = [
            'comfortable', 'soft', 'breathable', 'stretchy', 'durable',
            'lightweight', 'warm', 'cool', 'moisture-wicking', 'wrinkle-free',
            'easy-care', 'machine-washable', 'dry-clean-only', 'hand-wash',
            'trendy', 'classic', 'timeless', 'versatile', 'stylish',
            'affordable', 'premium', 'luxury', 'budget-friendly'
        ]
        
        found_tags = []
        for tag in tag_keywords:
            if tag in text:
                found_tags.append(tag)
        
        return found_tags