from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Telemetry:
    def __init__(self):
        self.latency_data = []
        self.query_data = {}

    def log_latency(self, endpoint: str, latency: float):
        self.latency_data.append({
            "endpoint": endpoint,
            "latency": latency,
            "timestamp": datetime.utcnow()
        })
        logger.info(f"Logged latency for {endpoint}: {latency}ms")

    def log_query(self, query: str):
        if query in self.query_data:
            self.query_data[query] += 1
        else:
            self.query_data[query] = 1
        logger.info(f"Logged query: {query}")

    def get_latency_stats(self):
        return self.latency_data

    def get_top_queries(self, top_n: int = 10):
        sorted_queries = sorted(self.query_data.items(), key=lambda item: item[1], reverse=True)
        return sorted_queries[:top_n]