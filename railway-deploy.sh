#!/bin/bash

# Railway deployment script
echo "🚀 Starting Railway deployment..."

# Install dependencies for backend
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Build the TypeScript code
echo "🔨 Building TypeScript..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Starting server..."
    npm start
else
    echo "❌ Build failed!"
    exit 1
fi 