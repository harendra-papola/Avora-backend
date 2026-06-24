#!/bin/bash
# Clean build script
# Run: bash scripts/clean-build.sh

set -e

echo "🧹 Cleaning previous builds..."
rm -rf dist

echo "🔨 Building project..."
npm run build

echo "✅ Build complete!"
echo "📂 Output: dist/"
echo ""
echo "To run: npm start"
