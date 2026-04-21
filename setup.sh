#!/bin/bash

# Z Book - Quick Setup Script
# This script helps you get started with the Z Book project

echo "🚀 Z Book - Quick Setup"
echo "======================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Copy .env file
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your MongoDB URI and JWT secret"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Ask if user wants to seed database
read -p "Do you want to seed the database with sample books? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    npm run seed
fi

cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend

# Copy .env.local file
if [ ! -f .env.local ]; then
    echo "Creating .env.local file from .env.local.example..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local file already exists"
fi

# Install dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Edit backend/.env with your MongoDB connection details"
echo "2. Start Backend: cd backend && npm run dev"
echo "3. Start Frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "- Backend: backend/README.md"
echo "- Frontend: frontend/README.md"
echo "- Deployment: DEPLOYMENT.md"
echo "- Project Summary: PROJECT_SUMMARY.md"
echo ""
echo "Happy coding! 🎉"
