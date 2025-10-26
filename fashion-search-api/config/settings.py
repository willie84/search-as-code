from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    weaviate_url: str
    weaviate_api_key: str
    search_config_path: str = "config/search.yaml"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()