
#!/bin/bash

# ZenithMail Hot-Deployment Script
# Optimized for AlmaLinux 8.9

set -e

echo "🚀 Starting ZenithMail Hot Deploy..."

# Verify .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found! Please create one before deploying."
    exit 1
fi

# 1. Build and Start Containers
echo "📦 Building and optimizing containers..."
docker compose -f infra/docker-compose.yml up -d --build

# 2. Clean up
echo "🧹 Cleaning up old artifacts..."
docker image prune -f

# 3. Health Check
echo "🔍 Checking cluster health..."
sleep 5
if docker ps | grep -q "zenithmail"; then
    echo "✅ ZenithMail is LIVE on AlmaLinux."
    URL=$(grep APP_URL .env | cut -d '=' -f2)
    echo "🔗 Dashboard: $URL"
else
    echo "❌ Deployment failed. Check logs with: docker compose logs"
fi
