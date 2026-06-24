#!/bin/bash
# Development setup script
# Run: bash scripts/dev-setup.sh

set -e

echo "🚀 Avora Backend - Development Setup"
echo "======================================"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔄 Generating Prisma client..."
npm run prisma:generate

echo ""
echo "📝 Running code quality checks..."
npm run type-check
echo "✅ Type check passed"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Configure .env file (copy from .env.example)"
echo "2. Setup database: bash scripts/setup-db.sh"
echo "3. Start development: npm run dev:watch"
echo ""
echo "📖 For more info, see DEVELOPMENT_GUIDE.md"
