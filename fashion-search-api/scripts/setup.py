from setuptools import setup, find_packages

setup(
    name="fashion-search-api",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "pydantic",
        "weaviate-client",
        "openai",
        "pyyaml",
        "httpx",
        "numpy",
        "scikit-learn",
        "pillow",
    ],
    entry_points={
        "console_scripts": [
            "run-api=api.main:app",
        ],
    },
)