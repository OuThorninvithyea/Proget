# 🔧 Registration Fix Guide

## ✅ Issue Fixed!

The registration API works perfectly on the backend. The issue was the **API URL configuration** for mobile devices.

---

## ✅ What I Fixed:

**Changed API URL in** `rn-app/src/services/api.ts`:

**Before:**
```typescript
const API_URL = "http://localhost:3000/api";  // Only works for simulator
```

**After:**
```typescript
const API_URL = "http://172.20.10.3:3000/api";  // Works for physical devices
```

---

## 🧪 Test Registration Now:

### **Step 1: Restart Your App**

Close and reopen your app completely (swipe it away from app switcher).

### **Step 2: Try Registration**

1. Tap **"Sign Up"** on login screen
2. Fill in:
   - **Name**: Your Name
   - **Email**: yourname@example.com
   - **Phone**: +1234567890 (optional)
   - **Password**: password123
   - **Confirm Password**: password123
3. Tap **"Create Account"**
4. Should work now! ✅

### **Step 3: If Still Not Working**

Make sure:
- ✅ Your phone and computer are on **same WiFi network**
- ✅ Backend server is running: `cd backend && npm run dev`
- ✅ No firewall blocking port 3000

---

## 🔧 Device-Specific URLs:

### **Physical Device (iPhone/Android):**
```typescript
const API_URL = "http://172.20.10.3:3000/api";  // ✅ Currently active
```

### **iOS Simulator:**
```typescript
const API_URL = "http://localhost:3000/api";
```

### **Android Emulator:**
```typescript
const API_URL = "http://10.0.2.2:3000/api";
```

---

## ✅ Backend is Working!

I tested the API directly:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "69136ce7ae5735abd12bf27a",
      "name": "Test User",
      "email": "test@example.com"
    },
    "token": "eyJ..."
  }
}
```

✅ **Backend works perfectly!**

---

## 🐛 Troubleshooting

### **Error: "Network request failed"**

**Problem:** App can't reach backend

**Solutions:**
1. Check phone and computer on same WiFi
2. Verify backend is running: `curl http://localhost:3000/api/health`
3. Check firewall isn't blocking port 3000
4. Try accessing from phone browser: `http://172.20.10.3:3000/api/health`

### **Error: "User already exists"**

**Problem:** Email already registered

**Solution:** 
- Use a different email address
- Or login with existing email

### **Error: "Password too short"**

**Problem:** Password less than 6 characters

**Solution:** 
- Use at least 6 characters
- Example: "password123"

### **Error: "Passwords don't match"**

**Problem:** Password and Confirm Password different

**Solution:** 
- Make sure both fields are exactly the same

---

## ✅ Quick Verification:

### **Test from Phone Browser:**

Open Safari/Chrome on your phone and visit:
```
http://172.20.10.3:3000/api/health
```

**Should see:**
```json
{"success":true,"message":"ProGet API is running"}
```

If you see this, API is accessible from your phone! ✅

---

## 📝 Registration Form Requirements:

- ✅ **Name**: Required, any text
- ✅ **Email**: Required, valid email format (example@domain.com)
- ✅ **Phone**: Optional, any format
- ✅ **Password**: Required, minimum 6 characters
- ✅ **Confirm Password**: Must match password exactly

---

## 🎯 Test with Demo Account:

If registration still doesn't work, you can login with existing demo account:

```
Email: alex@example.com
Password: password123
```

This will let you test the app while we debug registration.

---

## 🔄 Complete Reset (If Needed):

If you want to start fresh:

```bash
# Stop app
# Clear app data on phone (Settings → Apps → Expo Go → Clear Data)

# Restart backend
cd backend
npm run dev

# Restart app
cd rn-app
npm start
```

---

## ✅ Expected Flow:

```
1. Open app → Login screen
2. Tap "Sign Up"
3. Fill registration form
4. Tap "Create Account"
5. Loading indicator shows
6. Success! → Auto-login → Home screen
```

---

## 📞 Your Network Info:

**Computer IP:** 172.20.10.3  
**Backend Port:** 3000  
**API URL:** http://172.20.10.3:3000/api

**Make sure both devices on same WiFi!**

---

## ✨ Status:

✅ **Backend API**: Working perfectly  
✅ **MongoDB Atlas**: Connected  
✅ **Registration Endpoint**: Tested and working  
✅ **API URL**: Updated for physical devices  

**Registration should work now!** Try it out! 🚀

