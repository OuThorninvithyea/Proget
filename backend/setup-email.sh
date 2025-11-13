#!/bin/bash

# Email Configuration Setup Script for ProGet
# This script helps you add email configuration to your .env file

echo "=========================================="
echo "  ProGet - Email Configuration Setup"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Creating .env from template..."
    cp env.template .env
    echo "✅ Created .env file"
fi

# Check if email config already exists
if grep -q "SMTP_HOST" .env; then
    echo "⚠️  Email configuration already exists in .env"
    echo ""
    echo "Current configuration:"
    grep -E "SMTP|FROM_|FRONTEND" .env
    echo ""
    read -p "Do you want to update it? (y/n): " update_choice
    if [ "$update_choice" != "y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo ""
echo "📧 Email Service Setup"
echo ""
echo "Choose your email service:"
echo "1. Mailtrap (Recommended for Testing - Free)"
echo "2. Gmail (For Production)"
echo "3. Manual Entry"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📮 Mailtrap Setup"
        echo ""
        echo "1. Go to https://mailtrap.io/"
        echo "2. Sign up for a free account"
        echo "3. Get your SMTP credentials"
        echo ""
        read -p "Enter your Mailtrap username: " smtp_user
        read -p "Enter your Mailtrap password: " smtp_pass
        
        # Add to .env
        echo "" >> .env
        echo "# Email Configuration (Mailtrap - Testing)" >> .env
        echo "SMTP_HOST=smtp.mailtrap.io" >> .env
        echo "SMTP_PORT=2525" >> .env
        echo "SMTP_USER=$smtp_user" >> .env
        echo "SMTP_PASS=$smtp_pass" >> .env
        echo "FROM_NAME=ProGet" >> .env
        echo "FROM_EMAIL=noreply@proget.com" >> .env
        echo "FRONTEND_URL=http://localhost:3000" >> .env
        
        echo ""
        echo "✅ Mailtrap configuration added!"
        ;;
    
    2)
        echo ""
        echo "📮 Gmail Setup"
        echo ""
        echo "⚠️  Important: Use an App Password, not your regular password!"
        echo "1. Enable 2-Factor Authentication on your Gmail"
        echo "2. Go to: Google Account → Security → App Passwords"
        echo "3. Generate an App Password"
        echo ""
        read -p "Enter your Gmail address: " gmail_address
        read -p "Enter your Gmail App Password: " gmail_pass
        
        # Add to .env
        echo "" >> .env
        echo "# Email Configuration (Gmail - Production)" >> .env
        echo "SMTP_HOST=smtp.gmail.com" >> .env
        echo "SMTP_PORT=587" >> .env
        echo "SMTP_USER=$gmail_address" >> .env
        echo "SMTP_PASS=$gmail_pass" >> .env
        echo "FROM_NAME=ProGet" >> .env
        echo "FROM_EMAIL=$gmail_address" >> .env
        echo "FRONTEND_URL=http://localhost:3000" >> .env
        
        echo ""
        echo "✅ Gmail configuration added!"
        ;;
    
    3)
        echo ""
        echo "📮 Manual Configuration"
        echo ""
        read -p "SMTP Host: " smtp_host
        read -p "SMTP Port: " smtp_port
        read -p "SMTP Username: " smtp_user
        read -p "SMTP Password: " smtp_pass
        read -p "From Name: " from_name
        read -p "From Email: " from_email
        read -p "Frontend URL: " frontend_url
        
        # Add to .env
        echo "" >> .env
        echo "# Email Configuration (Custom)" >> .env
        echo "SMTP_HOST=$smtp_host" >> .env
        echo "SMTP_PORT=$smtp_port" >> .env
        echo "SMTP_USER=$smtp_user" >> .env
        echo "SMTP_PASS=$smtp_pass" >> .env
        echo "FROM_NAME=$from_name" >> .env
        echo "FROM_EMAIL=$from_email" >> .env
        echo "FRONTEND_URL=$frontend_url" >> .env
        
        echo ""
        echo "✅ Custom configuration added!"
        ;;
    
    *)
        echo "❌ Invalid choice. Setup cancelled."
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  ✅ Email Configuration Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Restart your backend server (npm run dev)"
echo "2. Test with: node test-forgot-password.js"
echo "3. Or test from your React Native app"
echo ""
echo "⚠️  IMPORTANT: Restart the server to load new settings!"
echo ""

