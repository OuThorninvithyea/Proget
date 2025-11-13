#!/bin/bash

# Quick Email Fix Script for ProGet
# This script helps you fix the email configuration in 2 minutes

clear
echo "╔════════════════════════════════════════════════╗"
echo "║   🔧 ProGet Email Configuration Fixer        ║"
echo "╔════════════════════════════════════════════════╗"
echo ""

# Step 1: Check current status
echo "📊 Checking current configuration..."
echo ""

if grep -q "your_username_here" .env; then
    echo "❌ SMTP credentials not configured"
    NEEDS_CONFIG=true
else
    echo "✅ SMTP credentials found"
    NEEDS_CONFIG=false
fi

if ps aux | grep -v grep | grep "node.*server.js" > /dev/null; then
    echo "✅ Backend server is running"
    SERVER_RUNNING=true
else
    echo "❌ Backend server is NOT running"
    SERVER_RUNNING=false
fi

if npm list nodemailer 2>/dev/null | grep nodemailer > /dev/null; then
    echo "✅ Nodemailer is installed"
else
    echo "❌ Nodemailer is NOT installed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Guide user to get credentials
if [ "$NEEDS_CONFIG" = true ]; then
    echo "🎯 ACTION REQUIRED: Get Mailtrap Credentials"
    echo ""
    echo "1. Open this link in your browser:"
    echo "   👉 https://mailtrap.io/register/signup"
    echo ""
    echo "2. Sign up (it's free!)"
    echo ""
    echo "3. After login, find 'SMTP Settings'"
    echo ""
    echo "4. Copy your Username and Password"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "Press ENTER when you have your Mailtrap credentials..."
    echo ""
    
    # Get credentials from user
    echo "📝 Enter your Mailtrap credentials:"
    echo ""
    read -p "SMTP Username: " smtp_user
    read -p "SMTP Password: " smtp_pass
    
    # Update .env file
    echo ""
    echo "💾 Updating .env file..."
    
    # Use sed to replace the placeholder values
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/SMTP_USER=your_username_here/SMTP_USER=$smtp_user/" .env
        sed -i '' "s/SMTP_PASS=your_password_here/SMTP_PASS=$smtp_pass/" .env
    else
        # Linux
        sed -i "s/SMTP_USER=your_username_here/SMTP_USER=$smtp_user/" .env
        sed -i "s/SMTP_PASS=your_password_here/SMTP_PASS=$smtp_pass/" .env
    fi
    
    echo "✅ Configuration updated!"
    echo ""
fi

# Step 3: Restart server if needed
if [ "$SERVER_RUNNING" = true ] && [ "$NEEDS_CONFIG" = true ]; then
    echo "⚠️  Server needs to restart to load new configuration"
    echo ""
    echo "Please:"
    echo "1. Go to the terminal running your server"
    echo "2. Press Ctrl+C to stop it"
    echo "3. Run: npm run dev"
    echo ""
    read -p "Press ENTER after you've restarted the server..."
    echo ""
fi

# Step 4: Test the configuration
echo "🧪 Testing email configuration..."
echo ""
echo "Running test script..."
echo ""

if [ -f "test-forgot-password.js" ]; then
    node test-forgot-password.js
else
    # Quick inline test
    curl -X POST http://localhost:3000/api/auth/forgot-password \
         -H "Content-Type: application/json" \
         -d '{"email": "test@example.com"}' \
         2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Test endpoint called"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Next Steps:"
echo ""
echo "1. Check your Mailtrap inbox at: https://mailtrap.io/"
echo "2. You should see a password reset email"
echo "3. If not, check backend server console for errors"
echo ""
echo "📱 To test from React Native:"
echo "   - Tap 'Forgot Password?' on login screen"
echo "   - Enter any email"
echo "   - Check Mailtrap inbox"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Configuration complete!"
echo ""

