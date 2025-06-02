#!/bin/bash

# HomeShare Deployment Script
echo "🚀 Starting HomeShare deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Database configuration check
echo "🗄️  Database Configuration:"
echo "This application uses PostgreSQL for both development and production"
echo ""
echo "⚠️  IMPORTANT: Make sure you have set up your DATABASE_URL"
echo "   For development: Set in .env.local"
echo "   For production: Set in Vercel environment variables"
echo "   Example: postgresql://username:password@host:port/database"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client."
    exit 1
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel dashboard:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo "   - CLERK_WEBHOOK_SECRET"
echo "2. Configure your database connection"
echo "3. Set up Clerk webhook endpoint"
echo "4. Test your deployed application"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
