#!/bin/bash
# Database initialization script
# Run: bash scripts/setup-db.sh

set -e

echo "🔧 Setting up database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy .env.example to .env and configure it"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔄 Generating Prisma client..."
npm run prisma:generate

echo "🗄️  Running database migrations..."
npm run prisma:migrate

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Start development server: npm run dev:watch"
echo "2. View database: npm run prisma:studio"
