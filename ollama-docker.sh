#!/bin/bash

# Ollama Docker Management Script

case "$1" in
  start)
    echo "🚀 Starting Ollama..."
    docker-compose up -d ollama
    echo "✅ Ollama started at http://localhost:11434"
    ;;
  stop)
    echo "🛑 Stopping Ollama..."
    docker-compose down
    ;;
  restart)
    echo "🔄 Restarting Ollama..."
    docker-compose restart ollama
    ;;
  logs)
    echo "📋 Showing Ollama logs..."
    docker-compose logs -f ollama
    ;;
  models)
    echo "📦 Available models:"
    docker exec ollama ollama list
    ;;
  pull)
    if [ -z "$2" ]; then
      echo "Usage: $0 pull <model_name>"
      echo "Example: $0 pull llama3.1:8b"
      exit 1
    fi
    echo "📥 Pulling model: $2"
    docker exec ollama ollama pull "$2"
    ;;
  shell)
    echo "🐚 Opening Ollama container shell..."
    docker exec -it ollama bash
    ;;
  status)
    echo "📊 Ollama container status:"
    docker-compose ps ollama
    ;;
  *)
    echo "Ollama Docker Management"
    echo "Usage: $0 {start|stop|restart|logs|models|pull|shell|status}"
    echo ""
    echo "Commands:"
    echo "  start   - Start Ollama container"
    echo "  stop    - Stop all containers"
    echo "  restart - Restart Ollama container"
    echo "  logs    - Show Ollama logs"
    echo "  models  - List available models"
    echo "  pull    - Pull a specific model"
    echo "  shell   - Open container shell"
    echo "  status  - Show container status"
    exit 1
    ;;
esac 