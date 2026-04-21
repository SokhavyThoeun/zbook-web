@echo off
REM Z Book - Quick Setup Script for Windows
REM This script helps you get started with the Z Book project

echo.
echo 🚀 Z Book - Quick Setup
echo =======================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your MongoDB URI
) else (
    echo ✅ .env file already exists
)

echo Installing backend dependencies...
call npm install

echo.
set /p SEED="Do you want to seed the database? (y/n): "
if /i "%SEED%"=="y" (
    echo Seeding database...
    call npm run seed
)

cd ..

REM Setup Frontend
echo.
echo 🎨 Setting up Frontend...
cd frontend

if not exist .env.local (
    echo Creating .env.local file from .env.local.example...
    copy .env.local.example .env.local
    echo ✅ .env.local created
) else (
    echo ✅ .env.local file already exists
)

echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📝 Next Steps:
echo 1. Edit backend\.env with your MongoDB connection details
echo 2. Start Backend: cd backend ^&^& npm run dev
echo 3. Start Frontend: cd frontend ^&^& npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 Documentation:
echo - Backend: backend\README.md
echo - Frontend: frontend\README.md
echo - Deployment: DEPLOYMENT.md
echo - Project Summary: PROJECT_SUMMARY.md
echo.
echo Happy coding! 🎉
echo.
pause
