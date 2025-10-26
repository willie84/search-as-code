from weaviate import Client

class Database:
    def __init__(self, weaviate_url: str):
        self.client = Client(weaviate_url)

    def create_schema(self, schema: dict):
        self.client.schema.create(schema)

    def add_product(self, product: dict):
        self.client.data_object.create(product, class_name="Product")

    def search(self, query: str):
        return self.client.query.get("Product", ["*"]).with_where({
            "path": ["title"],
            "operator": "Equal",
            "valueString": query
        }).do()

    def enrich_product(self, product_id: str, enriched_data: dict):
        self.client.data_object.update(enriched_data, product_id, class_name="Product")