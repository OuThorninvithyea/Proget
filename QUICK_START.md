# 🚀 Quick Start Guide

## ✅ Setup Complete!

Your MongoDB backend is fully configured and running. Here's how to use it:

---

## 📱 Run Your React Native App

### Step 1: Update API URL (if using physical device)

Open `rn-app/src/services/api.ts` and uncomment the line for your device:

```typescript
// For Physical Device:
const API_URL = 'http://172.20.10.3:3000/api';
```

### Step 2: Start the App

```bash
cd rn-app
npm start
```

### Step 3: Scan QR Code

- Open **Expo Go** app on your phone
- Scan the QR code in terminal
- Wait for app to load

---

## 🔐 Test Login

Use these credentials to login:

- **Email:** `alex@example.com`
- **Password:** `password123`

---

## 🎫 What's Available?

### Events in Database:
1. Summer Music Festival 2025 - $89.99
2. Rock Legends Live - $120.00
3. Jazz Night Under Stars - $65.00
4. Electronic Dance Night - $45.00
5. Classical Symphony Orchestra - $95.00

### Features Working:
- ✅ User authentication
- ✅ Browse events (from database)
- ✅ Book tickets
- ✅ View tickets
- ✅ Order history
- ✅ User profile
- ✅ Settings (language, theme, privacy)
- ✅ Ticket marketplace

---

## 🛠️ Useful Commands

### Check if backend is running:
```bash
curl http://localhost:3000/api/health
```

### View MongoDB data:
```bash
mongosh
use proget
db.events.find()
```

### Stop backend:
```bash
lsof -ti:3000 | xargs kill
```

### Restart backend:
```bash
cd backend && npm run dev
```

---

## 📚 Full Documentation

- `SETUP_COMPLETE.md` - Complete setup details
- `MONGODB_SETUP.md` - MongoDB installation guide
- `backend/README.md` - API documentation

---

## 🆘 Need Help?

### Common Issues:

**Can't connect to backend:**
- Make sure phone and computer on same Wi-Fi
- Check API_URL matches your computer's IP (172.20.10.3)
- Verify backend is running: `curl http://localhost:3000/api/health`

**MongoDB not running:**
```bash
brew services start mongodb/brew/mongodb-community
```

**Backend won't start:**
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill
# Then start again
cd backend && npm run dev
```

---

**🎉 You're all set! Start building amazing features!**

