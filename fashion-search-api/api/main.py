from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import enrich, search, feedback, auth, admin, bulk_upload, recommendations, user_auth, products, ranking_demo, ad_campaigns, unified_search
from services.config_manager import ConfigManager
from services.domain_config_service import DomainConfigService

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load configuration
config_manager = ConfigManager()
domain_config_service = DomainConfigService()

# Include API endpoints
app.include_router(enrich.router, prefix="/enrich", tags=["enrich"])
app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(bulk_upload.router, prefix="/bulk", tags=["bulk-upload"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
app.include_router(user_auth.router, prefix="/user", tags=["user-authentication"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(ranking_demo.router, prefix="/ranking-demo", tags=["ranking-demo"])
app.include_router(ad_campaigns.router, prefix="/ads", tags=["ad-campaigns"])
app.include_router(unified_search.router, prefix="/unified", tags=["unified-search"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Multi-Domain Search-as-Code API!",
        "available_domains": domain_config_service.get_available_domains(),
        "version": "2.0.0"
    }

@app.get("/domains")
async def get_available_domains():
    """Get list of available search domains"""
    return {
        "domains": domain_config_service.get_available_domains(),
        "default": "clothing"
    }