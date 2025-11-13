# 🚨 QUICK FIX: Email Not Sending

## 🎯 The Problem

Password reset emails aren't being sent because SMTP credentials are missing.

## ✅ The Solution (2 minutes)

### Option 1: Automated Fix (Easiest) ⭐

Run this command:

```bash
cd "/Users/vithea/Downloads/FinalAssignment 4/Proget/backend"
./fix-email.sh
```

Follow the prompts!

### Option 2: Manual Fix (2 minutes)

#### Step 1: Get Mailtrap Credentials

1. Go to: https://mailtrap.io/register/signup
2. Sign up (free)
3. Look for "SMTP Settings"
4. Copy Username and Password

#### Step 2: Update .env File

Open: `/backend/.env`

Find these lines:

```env
SMTP_USER=your_username_here
SMTP_PASS=your_password_here
```

Replace with your credentials:

```env
SMTP_USER=abc123xyz
SMTP_PASS=def456uvw
```

Save the file!

#### Step 3: Restart Backend Server

```bash
# In terminal running backend:
# Press Ctrl+C, then:
npm run dev
```

#### Step 4: Test It

```bash
cd backend
node test-forgot-password.js
```

Check Mailtrap inbox at https://mailtrap.io/

---

## 📊 Debug Summary

```
✅ Backend Running:     YES (port 3000)
✅ Nodemailer:          Installed (v6.10.1)
✅ Endpoint Working:    YES (/api/auth/forgot-password)
✅ .env File:           Exists
❌ SMTP Credentials:    MISSING ← FIX THIS
```

---

## 🧪 How to Test

### Test 1: Command Line

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test 2: React Native App

1. Tap "Forgot Password?"
2. Enter email
3. Check Mailtrap inbox

---

## 📝 What You Need

| Item      | Value                      | Status              |
| --------- | -------------------------- | ------------------- |
| SMTP Host | `sandbox.smtp.mailtrap.io` | ✅ Already set      |
| SMTP Port | `2525`                     | ✅ Already set      |
| SMTP User | Your Mailtrap username     | ❌ **NEEDS UPDATE** |
| SMTP Pass | Your Mailtrap password     | ❌ **NEEDS UPDATE** |

---

## ⚡ TL;DR

1. Get credentials from https://mailtrap.io/
2. Edit `/backend/.env`
3. Update SMTP_USER and SMTP_PASS
4. Restart server: `npm run dev`
5. Test: `node test-forgot-password.js`
6. Check Mailtrap inbox

**Time needed: 2 minutes**

---

## 📚 Full Documentation

- **Complete guide**: `DEBUG_EMAIL_ISSUE.md`
- **Setup guide**: `FORGOT_PASSWORD_SETUP.md`
- **Quick start**: `FORGOT_PASSWORD_QUICKSTART.md`

---

**Status**: Ready to fix (just needs credentials)
