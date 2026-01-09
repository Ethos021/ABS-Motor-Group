#!/bin/bash

# ABS Motor Group Backend Setup Script

echo "================================================"
echo "ABS Motor Group Backend Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    exit 1
fi

echo "✓ PostgreSQL is installed"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file with your database credentials:"
    echo "   - DB_HOST"
    echo "   - DB_PORT"
    echo "   - DB_NAME"
    echo "   - DB_USER"
    echo "   - DB_PASSWORD"
    echo "   - JWT_SECRET (change in production!)"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

# Create database
echo ""
echo "Creating database..."
echo "Enter your PostgreSQL password when prompted:"

# Extract DB_NAME from .env file, handling quotes and spaces
DB_NAME=$(grep "^DB_NAME=" .env | cut -d '=' -f2- | sed 's/^["'\'']*//;s/["'\'']*$//' | xargs)
if [ -z "$DB_NAME" ]; then
    echo "❌ Could not extract DB_NAME from .env file"
    exit 1
fi

createdb "$DB_NAME" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database '$DB_NAME' created"
else
    echo "⚠️  Database might already exist or creation failed"
fi

# Run migrations
echo ""
echo "Running database migrations..."
npm run migrate

if [ $? -ne 0 ]; then
    echo "❌ Migration failed"
    exit 1
fi

echo "✓ Migrations completed"

# Done
echo ""
echo "================================================"
echo "✓ Setup completed successfully!"
echo "================================================"
echo ""
echo "To start the server:"
echo "  npm start       (production)"
echo "  npm run dev     (development with auto-reload)"
echo ""
echo "The API will be available at http://localhost:3000"
echo "Health check: http://localhost:3000/health"
echo ""
