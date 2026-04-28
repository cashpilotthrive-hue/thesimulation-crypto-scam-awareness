#!/bin/bash
set -e

echo "🦀 OpenClaw Deployment Script"
echo "================================"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    exit 1
fi

mkdir -p data ssl

if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "🚀 Building and starting..."
docker-compose up -d --build

sleep 10

echo "✅ Checking health..."
curl -f http://localhost:3000/health

echo "🎉 OpenClaw deployed!"
echo "   Frontend: http://localhost"
echo "   Backend: http://localhost:3000"