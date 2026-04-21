#!/bin/bash

echo "=========================================="
echo "   Z Book Store - Deployment Helper"
echo "=========================================="
echo ""

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed"
        return 1
    else
        echo "✅ $1 is installed"
        return 0
    fi
}

echo "Checking prerequisites..."
echo ""

check_command node
check_command npm
check_command git

echo ""
echo "=========================================="
echo "   Deployment Checklist"
echo "=========================================="
echo ""
echo "Before deploying to Render.com, ensure:"
echo ""
echo "1. ✅ All code changes are committed to git"
echo "2. ✅ You have a Render.com account"
echo "3. ✅ Your repo is on GitHub"
echo ""
echo "=========================================="
echo "   Next Steps"
echo "=========================================="
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fixed login/signup and updated for deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo ""
echo "3. Create Backend Service:"
echo "   - New → Web Service"
echo "   - Connect your GitHub repo"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "4. Create Frontend Service:"
echo "   - New → Static Site"
echo "   - Connect your GitHub repo"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: out"
echo ""
echo "5. See DEPLOYMENT.md for full instructions"
echo ""
echo "=========================================="
echo "   Local Testing"
echo "=========================================="
echo ""
echo "To test locally:"
echo ""
echo "Terminal 1 (Backend):"
echo "   cd backend && npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:3000"
echo ""
echo "=========================================="
