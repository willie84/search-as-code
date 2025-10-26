from faker import Faker
import random
import json

fake = Faker()

def generate_mock_product_data(num_products=100):
    products = []
    for _ in range(num_products):
        product = {
            "id": fake.uuid4(),
            "title": fake.catch_phrase(),
            "description": fake.text(max_nb_chars=200),
            "price": round(random.uniform(10.0, 200.0), 2),
            "image_url": fake.image_url(),
        }
        products.append(product)
    return products

if __name__ == "__main__":
    mock_data = generate_mock_product_data()
    with open("data/mock_products.json", "w") as f:
        json.dump(mock_data, f, indent=4)