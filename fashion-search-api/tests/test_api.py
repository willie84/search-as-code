from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_enrich_endpoint():
    response = client.post("/enrich", json=[
        {
            "id": "1",
            "title": "Stylish T-Shirt",
            "description": "A stylish t-shirt for casual wear.",
            "price": 19.99,
            "image_url": "http://example.com/tshirt.jpg"
        }
    ])
    assert response.status_code == 200
    enriched_data = response.json()
    assert "color" in enriched_data[0]
    assert "style" in enriched_data[0]
    assert "fabric" in enriched_data[0]
    assert "occasion" in enriched_data[0]
    assert "embedding" in enriched_data[0]

def test_search_endpoint():
    response = client.post("/search", json={"query": "Stylish T-Shirt"})
    assert response.status_code == 200
    search_results = response.json()
    assert isinstance(search_results, list)

def test_feedback_endpoint():
    response = client.post("/feedback", json={"product_id": "1", "action": "click"})
    assert response.status_code == 200
    assert response.json() == {"message": "Feedback logged successfully."}