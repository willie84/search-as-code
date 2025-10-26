from fastapi import Request, Response
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response: Response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

async def add_process_time_header(request: Request, call_next):
    import time
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response