from fastapi import FastAPI
from fastapi.testclient import TestClient
from services.enrichment_service import enrich_product_data
from services.search_service import search_products
from services.telemetry import log_feedback

app = FastAPI()

client = TestClient(app)

def test_enrich_product_data():
    raw_product = {
        "id": "1",
        "title": "Stylish Dress",
        "description": "A beautiful dress for all occasions.",
        "price": 49.99,
        "image_url": "http://example.com/dress.jpg"
    }
    response = enrich_product_data(raw_product)
    assert response["id"] == "1"
    assert "color" in response
    assert "style" in response
    assert "fabric" in response
    assert "occasion" in response
    assert "embedding" in response

def test_search_products():
    query = "Stylish Dress"
    response = search_products(query)
    assert isinstance(response, list)
    assert len(response) > 0

def test_log_feedback():
    feedback_data = {
        "product_id": "1",
        "user_action": "click"
    }
    response = log_feedback(feedback_data)
    assert response["status"] == "success"