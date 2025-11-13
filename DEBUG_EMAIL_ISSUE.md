# 🔍 DEBUG: Email Not Sending Issue - SOLVED

## 📊 Current Status

✅ **Backend server**: Running (port 3000)  
✅ **Nodemailer**: Installed (v6.10.1)  
✅ **Forgot password route**: Working  
❌ **Email configuration**: Missing credentials  
❌ **Emails**: Not being sent

---

## 🎯 The Problem

Your `.env` file has email configuration, but the credentials are placeholders:

```env
SMTP_USER=your_username_here   # ❌ Needs real credentials
SMTP_PASS=your_password_here   # ❌ Needs real credentials
```

Without real SMTP credentials, the email service can't connect to send emails.

---

## ✅ THE SOLUTION (2 minutes)

### Step 1: Get FREE Mailtrap Credentials

1. **Go to**: https://mailtrap.io/
2. **Click**: "Sign Up" (it's free!)
3. **Sign up** with email or Google
4. **After login**, you'll see your inbox
5. **Click** on the inbox name
6. **Look for**: "SMTP Settings" section
7. **Copy** the Username and Password

**Screenshot guide:**

```
┌─────────────────────────────────┐
│  SMTP Settings                  │
├─────────────────────────────────┤
│  Host: sandbox.smtp.mailtrap.io │
│  Port: 2525                     │
│  Username: 1a2b3c4d5e6f7g  ← COPY THIS
│  Password: 9h8i7j6k5l4m3n  ← COPY THIS
│  Auth: Plain                    │
└─────────────────────────────────┘
```

### Step 2: Update Your .env File

**Open**: `/backend/.env`

**Find these lines** (at the bottom):

```env
SMTP_USER=your_username_here
SMTP_PASS=your_password_here
```

**Replace with your credentials**:

```env
SMTP_USER=1a2b3c4d5e6f7g
SMTP_PASS=9h8i7j6k5l4m3n
```

**Save the file!**

### Step 3: Restart Backend Server

The server needs to reload the new environment variables.

**In your terminal running the backend:**

1. Press `Ctrl+C` to stop
2. Run: `npm run dev`

You should see:

```
🚀 Server running on port 3000
📍 http://localhost:3000
```

---

## 🧪 TEST IT NOW

### Test 1: Command Line Test

```bash
cd "/Users/vithea/Downloads/FinalAssignment 4/Proget/backend"
node test-forgot-password.js
```

**Expected output:**

```
🧪 Testing Forgot Password Feature
==================================================

✓ Backend server is running!

Test 1: Request password reset
✓ Password reset email sent!

Response: {
  "success": true,
  "message": "Password reset email sent successfully",
  "resetToken": "abc123...",
  "resetUrl": "http://localhost:3000/reset-password/abc123..."
}
```

### Test 2: Check Mailtrap Inbox

1. **Go to**: https://mailtrap.io/
2. **Login**
3. **Click** on your inbox
4. **You should see** the password reset email!

### Test 3: React Native App Test

1. **Open your React Native app**
2. **Tap** "Forgot Password?" on login screen
3. **Enter** any email (e.g., "test@example.com")
4. **Tap** "Send Reset Link"
5. **Check Mailtrap inbox** for the email

---

## 📧 What the Email Looks Like

When it works, you'll see an email in Mailtrap with:

**Subject**: ProGet Password Reset Request

**Content**:

```
You are receiving this email because you (or someone else)
has requested a password reset for your ProGet account.

[Reset Password Button]

This link will expire in 10 minutes.
```

---

## 🐛 Debugging Checklist

If it still doesn't work, check:

- [ ] Mailtrap credentials are copied correctly (no extra spaces)
- [ ] Backend server was restarted after updating .env
- [ ] .env file is in `/backend/.env` (not `env.template`)
- [ ] No syntax errors in .env file
- [ ] Backend server is running (`npm run dev`)

---

## 🔍 Check Backend Logs

If emails still aren't sending, check the backend console for errors:

**Common errors:**

### Error: "Invalid login"

```
❌ Problem: Wrong SMTP credentials
✅ Solution: Re-copy credentials from Mailtrap
```

### Error: "ECONNREFUSED"

```
❌ Problem: Can't connect to SMTP server
✅ Solution: Check internet connection
```

### Error: "Missing credentials"

```
❌ Problem: .env not loaded or server not restarted
✅ Solution: Restart server with Ctrl+C then npm run dev
```

---

## 📋 Quick Reference

### Your Current Configuration

```env
# Current .env settings
SMTP_HOST=sandbox.smtp.mailtrap.io  ✅
SMTP_PORT=2525                       ✅
SMTP_USER=your_username_here         ❌ NEEDS UPDATE
SMTP_PASS=your_password_here         ❌ NEEDS UPDATE
FROM_NAME=ProGet                     ✅
FROM_EMAIL=noreply@proget.com        ✅
FRONTEND_URL=http://localhost:3000   ✅
```

**What needs to change:**

- Replace `SMTP_USER` with your Mailtrap username
- Replace `SMTP_PASS` with your Mailtrap password

---

## 🎯 Complete Step-by-Step Commands

Copy and paste these commands one by one:

```bash
# 1. Open .env file in your editor
open -a TextEdit "/Users/vithea/Downloads/FinalAssignment 4/Proget/backend/.env"

# 2. Update SMTP_USER and SMTP_PASS with your Mailtrap credentials
# (Do this manually in the text editor)

# 3. Go to backend directory
cd "/Users/vithea/Downloads/FinalAssignment 4/Proget/backend"

# 4. Stop the server if running (Ctrl+C)
# Then restart:
npm run dev

# 5. In another terminal, test it:
cd "/Users/vithea/Downloads/FinalAssignment 4/Proget/backend"
node test-forgot-password.js

# 6. Check Mailtrap inbox at https://mailtrap.io/
```

---

## 💡 Pro Tips

1. **Mailtrap is not a real email service**: Emails stay in Mailtrap, they don't go to real inboxes. Perfect for testing!

2. **Always restart the server**: After changing `.env`, the server must restart to load new values.

3. **Check the right inbox**: Log in to Mailtrap.io to see emails, not your real email.

4. **Test from command line first**: Use `node test-forgot-password.js` before testing from the app.

---

## 🎉 When It Works

You'll know it's working when:

✅ Test script shows: "Password reset email sent successfully"  
✅ No errors in backend console  
✅ Email appears in Mailtrap inbox  
✅ React Native app shows: "Check Your Email"  
✅ Email contains reset link with token

---

## 📞 Still Not Working?

Run this diagnostic command:

```bash
cd "/Users/vithea/Downloads/FinalAssignment 4/Proget/backend"
node -e "
require('dotenv').config();
console.log('Email Configuration:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
"
```

This will show if your environment variables are loaded correctly.

---

## 🚀 Next Steps After It Works

1. ✅ Test forgot password from React Native app
2. ✅ Try the complete flow: request reset → click link → set new password
3. ✅ Test token expiration (wait 11 minutes, token should expire)
4. For production: Switch from Mailtrap to Gmail or SendGrid

---

**Debug Status**: Ready to test after updating credentials  
**Estimated Time to Fix**: 2 minutes  
**Difficulty**: Easy

**Just update those two lines in .env and restart the server!** 🎯
