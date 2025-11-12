#!/bin/bash

# Update MongoDB Atlas Connection Script
echo "🌐 MongoDB Atlas Connection Update"
echo "=================================="
echo ""

# Get current connection string
echo "Your current connection (local MongoDB):"
grep "MONGODB_URI" .env

echo ""
echo "To connect to your MongoDB Atlas cluster:"
echo ""
echo "1. Go to: https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/overview"
echo "2. Click 'Connect' on your cluster"
echo "3. Select 'Drivers'"
echo "4. Copy your connection string"
echo "5. Replace <password> with your actual database password"
echo "6. Add '/proget' before the '?'"
echo ""
echo "Example format:"
echo "mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/proget?retryWrites=true&w=majority"
echo ""
echo "Enter your MongoDB Atlas connection string (or press Ctrl+C to cancel):"
read -r ATLAS_URI

if [ -z "$ATLAS_URI" ]; then
    echo "❌ No connection string provided. Cancelled."
    exit 1
fi

# Validate it looks like a MongoDB URI
if [[ ! "$ATLAS_URI" =~ ^mongodb ]]; then
    echo "❌ Invalid connection string. Must start with 'mongodb' or 'mongodb+srv'"
    exit 1
fi

# Backup current .env
cp .env .env.backup
echo "✅ Backed up current .env to .env.backup"

# Update .env file
cat > .env << EOF
# MongoDB Configuration - ATLAS CLOUD
MONGODB_URI=$ATLAS_URI

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=proget_jwt_secret_key_2025_change_in_production
JWT_EXPIRE=7d

# API Version
API_VERSION=v1
EOF

echo "✅ Updated .env file with Atlas connection"
echo ""
echo "Next steps:"
echo "1. Make sure your IP is whitelisted in Atlas (Network Access)"
echo "2. Restart your server: npm run dev"
echo "3. Re-seed the database: npm run seed"
echo ""
echo "To revert to local MongoDB, restore backup:"
echo "  mv .env.backup .env"

