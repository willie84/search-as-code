import pytest
from fastapi.testclient import TestClient
from api.main import app

@pytest.fixture(scope="module")
def test_client():
    client = TestClient(app)
    yield client

@pytest.fixture
def sample_product():
    return {
        "id": "1",
        "title": "Sample Product",
        "description": "A sample product for testing.",
        "price": 29.99,
        "image_url": "http://example.com/image.jpg"
    }