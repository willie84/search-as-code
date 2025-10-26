#!/bin/bash

# This script deploys the Fashion Search-as-Code API application.

# Step 1: Build the Docker image
echo "Building the Docker image..."
docker build -t fashion-search-api .

# Step 2: Start the services using Docker Compose
echo "Starting the services..."
docker-compose up -d

# Step 3: Load sample data into the database
echo "Loading sample data..."
python scripts/load_data.py

# Step 4: Display the running services
echo "Deployment complete. The following services are running:"
docker ps

# Step 5: Provide access information
echo "You can access the API at http://localhost:8000/docs"