#!/bin/bash

# Production Build Script for Laeeq Portfolio
echo "🚀 Building Laeeq Portfolio for Production..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Build client (React frontend)
echo "📦 Building frontend..."
npx vite build --outDir dist/public

# Build server (Express backend)
echo "📦 Building backend..."
npx esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:express --external:pg --external:drizzle-orm --external:@neondatabase/serverless

# Copy package.json for production dependencies
echo "📋 Copying package.json..."
cp package.json dist/

# Create production environment template
echo "🔧 Creating production environment template..."
cat > dist/.env.example << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_connection_string
VITE_SCHOLAR_API_KEY=your_google_scholar_api_key
EOF

echo "✅ Build completed successfully!"
echo "📁 Files ready in ./dist directory"
echo ""
echo "Next steps:"
echo "1. Copy dist/ folder to your Ubuntu server"
echo "2. Run 'npm install --production' in the dist folder"
echo "3. Create .env file with your actual values"
echo "4. Start with 'node index.js' or 'pm2 start index.js'"