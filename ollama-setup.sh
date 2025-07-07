#!/bin/bash

echo "🐳 Setting up Ollama in Docker..."

# Start Ollama service
echo "Starting Ollama container..."
docker-compose up -d ollama

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
sleep 10

# Pull recommended models
echo "📦 Pulling recommended models..."

# Fast model for development (8B parameters)
echo "Pulling llama3.1:8b (recommended for development)..."
docker exec ollama ollama pull llama3.1:8b

# Code-specific model (excellent for blockchain/coding tasks)
echo "Pulling qwen2.5:7b (excellent for coding)..."
docker exec ollama ollama pull qwen2.5:7b

# Alternative models (optional)
# echo "Pulling additional models..."
# docker exec ollama ollama pull mistral:7b

# Uncomment for better quality but requires more RAM (70B parameters)
# echo "Pulling llama3.1:70b (high quality, requires 64GB+ RAM)..."
# docker exec ollama ollama pull llama3.1:70b

echo "✅ Ollama setup complete!"
echo ""
echo "Available models:"
docker exec ollama ollama list

echo ""
echo "🚀 You can now use Ollama at: http://localhost:11434"
echo "💡 Update your .env file with:"
echo "   LLM_PROVIDER=ollama"
echo "   OLLAMA_BASE_URL=http://localhost:11434"
echo "   OLLAMA_MODEL=llama3.1:8b" 