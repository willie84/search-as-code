import re
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class DomainDetectionService:
    def __init__(self):
        # Define keywords for each domain
        self.domain_keywords = {
            'clothing': [
                # Clothing items
                'shirt', 'dress', 'pants', 'jeans', 'jacket', 'coat', 'sweater', 'hoodie',
                't-shirt', 'blouse', 'skirt', 'shorts', 'suit', 'tie', 'hat', 'cap',
                'shoes', 'boots', 'sneakers', 'sandals', 'heels', 'flats', 'socks',
                'underwear', 'lingerie', 'bra', 'panties', 'swimwear', 'bikini',
                'gloves', 'scarf', 'belt', 'watch', 'jewelry', 'necklace', 'ring',
                'earrings', 'bracelet', 'bag', 'purse', 'backpack', 'handbag',
                # Clothing attributes
                'cotton', 'silk', 'wool', 'leather', 'denim', 'linen', 'polyester',
                'casual', 'formal', 'elegant', 'stylish', 'fashion', 'trendy',
                'size', 'small', 'medium', 'large', 'xl', 'xxl', 'petite', 'plus',
                # Colors
                'red', 'blue', 'green', 'black', 'white', 'pink', 'yellow', 'purple',
                'orange', 'brown', 'gray', 'grey', 'navy', 'burgundy', 'maroon'
            ],
            'electronics': [
                # Electronics items
                'laptop', 'computer', 'phone', 'smartphone', 'tablet', 'ipad',
                'headphones', 'speaker', 'camera', 'tv', 'television', 'monitor',
                'keyboard', 'mouse', 'printer', 'scanner', 'router', 'modem',
                'charger', 'cable', 'usb', 'hdmi', 'bluetooth', 'wifi', 'wireless',
                'battery', 'power', 'adapter', 'case', 'cover', 'screen', 'display',
                # Electronics attributes
                'gaming', 'gaming laptop', 'gaming pc', 'gaming mouse', 'gaming keyboard',
                'wireless', 'bluetooth', 'smart', 'digital', 'electronic', 'tech',
                'android', 'ios', 'windows', 'mac', 'apple', 'samsung', 'sony',
                'nvidia', 'intel', 'amd', 'ram', 'storage', 'ssd', 'hdd', 'gb', 'tb'
            ],
            'furniture': [
                # Furniture items
                'sofa', 'couch', 'chair', 'table', 'desk', 'bed', 'mattress',
                'dresser', 'wardrobe', 'closet', 'bookshelf', 'shelf', 'cabinet',
                'nightstand', 'coffee table', 'dining table', 'dining chair',
                'ottoman', 'bench', 'stool', 'lamp', 'light', 'mirror', 'rug',
                'curtains', 'blinds', 'pillow', 'cushion', 'blanket', 'comforter',
                # Furniture attributes
                'wooden', 'wood', 'metal', 'glass', 'leather', 'fabric', 'upholstered',
                'modern', 'contemporary', 'traditional', 'vintage', 'antique',
                'comfortable', 'ergonomic', 'adjustable', 'reclining', 'sectional',
                'king', 'queen', 'full', 'twin', 'single', 'double', 'size'
            ],
            'groceries': [
                # Food items
                'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry',
                'bread', 'milk', 'cheese', 'butter', 'eggs', 'meat', 'chicken',
                'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'lobster',
                'vegetable', 'tomato', 'potato', 'onion', 'carrot', 'lettuce',
                'spinach', 'broccoli', 'cauliflower', 'pepper', 'cucumber',
                'rice', 'pasta', 'noodles', 'cereal', 'oats', 'quinoa', 'beans',
                'nuts', 'almonds', 'walnuts', 'peanuts', 'cashews', 'pistachios',
                'yogurt', 'ice cream', 'chocolate', 'candy', 'snack', 'chips',
                'cookies', 'cake', 'pie', 'juice', 'soda', 'water', 'coffee', 'tea',
                # Grocery attributes
                'organic', 'fresh', 'frozen', 'canned', 'dried', 'raw', 'cooked',
                'healthy', 'natural', 'sugar-free', 'low-fat', 'gluten-free',
                'dairy-free', 'vegan', 'vegetarian', 'kosher', 'halal',
                'local', 'farm', 'farmers market', 'grocery', 'supermarket'
            ]
        }
        
        # Create reverse lookup for faster detection
        self.keyword_to_domain = {}
        for domain, keywords in self.domain_keywords.items():
            for keyword in keywords:
                self.keyword_to_domain[keyword.lower()] = domain

    def detect_domain(self, query: str) -> str:
        """
        Detect the most likely domain based on the search query
        Returns the domain with the highest keyword match score
        """
        if not query:
            return 'clothing'  # Default domain
            
        query_lower = query.lower()
        
        # Count keyword matches for each domain
        domain_scores = {}
        for domain in self.domain_keywords.keys():
            domain_scores[domain] = 0
            
        # Split query into words and check for matches
        words = re.findall(r'\b\w+\b', query_lower)
        
        for word in words:
            if word in self.keyword_to_domain:
                domain = self.keyword_to_domain[word]
                domain_scores[domain] += 1
                
        # Also check for multi-word phrases
        for domain, keywords in self.domain_keywords.items():
            for keyword in keywords:
                if ' ' in keyword and keyword in query_lower:
                    domain_scores[domain] += 2  # Multi-word matches get higher score
                    
        # Find domain with highest score
        best_domain = max(domain_scores, key=domain_scores.get)
        best_score = domain_scores[best_domain]
        
        # If no keywords matched, use default
        if best_score == 0:
            best_domain = 'clothing'
            
        logger.info(f"Query '{query}' detected as domain '{best_domain}' (score: {best_score})")
        return best_domain

    def get_domain_confidence(self, query: str) -> Dict[str, Any]:
        """
        Get confidence scores for all domains
        """
        if not query:
            return {'clothing': 1.0, 'electronics': 0.0, 'furniture': 0.0, 'groceries': 0.0}
            
        query_lower = query.lower()
        domain_scores = {}
        total_keywords = 0
        
        for domain in self.domain_keywords.keys():
            domain_scores[domain] = 0
            
        words = re.findall(r'\b\w+\b', query_lower)
        
        for word in words:
            if word in self.keyword_to_domain:
                domain = self.keyword_to_domain[word]
                domain_scores[domain] += 1
                total_keywords += 1
                
        # Calculate confidence scores
        if total_keywords == 0:
            return {'clothing': 1.0, 'electronics': 0.0, 'furniture': 0.0, 'groceries': 0.0}
            
        confidence_scores = {}
        for domain, score in domain_scores.items():
            confidence_scores[domain] = score / total_keywords if total_keywords > 0 else 0.0
            
        return confidence_scores
