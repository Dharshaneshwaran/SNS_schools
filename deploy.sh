#!/bin/bash
# Deployment script for Render.com
# Run locally to test production build before deploying

set -e

echo "==> SNS Schools Deployment Test"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

cd backend

print_info "Step 1: Removing old dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true

print_status "Cleaned node_modules"

print_info "Step 2: Installing dependencies (clean install)..."
npm ci --prefer-offline --no-audit

print_status "Dependencies installed"

print_info "Step 3: Generating Prisma client..."
NODE_OPTIONS="--max-old-space-size=2048" npx prisma generate

print_status "Prisma client generated"

print_info "Step 4: Building application..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

print_status "Build completed successfully"

print_info "Step 5: Checking build artifacts..."
if [ -d "dist" ] && [ -f "dist/main.js" ]; then
    print_status "Build artifacts verified"
else
    print_error "Build artifacts not found!"
    exit 1
fi

print_info "Step 6: Calculating build size..."
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "    Build size: $BUILD_SIZE"

print_info "Step 7: Testing environment file creation..."
node -e "const fs = require('fs'); if (!fs.existsSync('.env')) fs.writeFileSync('.env', ''); console.log('    .env created')"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ All deployment checks passed!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Verify the .env file contains all required variables"
echo "2. Push changes to GitHub"
echo "3. Render will automatically deploy"
echo ""
echo "To test locally in production mode:"
echo "  NODE_OPTIONS='--max-old-space-size=1024' npm run start:prod"
