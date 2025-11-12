# 🌐 Your MongoDB Atlas Connection

## ✅ Your Connection Details

**Username:** `vithyeass_db_user`  
**Cluster:** `proget.bfcpim5.mongodb.net`  
**Database:** `proget`

---

## 🔧 Step 1: Update .env File

Open `backend/.env` file and **replace** the entire `MONGODB_URI` line with:

```env
MONGODB_URI=mongodb+srv://vithyeass_db_user:YOUR_PASSWORD_HERE@proget.bfcpim5.mongodb.net/proget?retryWrites=true&w=majority&appName=proget
```

**⚠️ IMPORTANT:** Replace `YOUR_PASSWORD_HERE` with your actual MongoDB Atlas database password!

### Complete .env File Should Look Like:

```env
# MongoDB Configuration - ATLAS CLOUD
MONGODB_URI=mongodb+srv://vithyeass_db_user:YOUR_PASSWORD_HERE@proget.bfcpim5.mongodb.net/proget?retryWrites=true&w=majority&appName=proget

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=proget_jwt_secret_key_2025_change_in_production
JWT_EXPIRE=7d

# API Version
API_VERSION=v1
```

---

## 🔐 Step 2: Get Your Database Password

If you don't remember your password:

1. Go to: https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/security/database/users
2. Find user: `vithyeass_db_user`
3. Click **"Edit"**
4. Click **"Edit Password"**
5. Set a new password
6. Click **"Update User"**
7. Use this new password in your `.env` file

---

## 🌐 Step 3: Whitelist Your IP

1. Go to: https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/security/network/accessList
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. **Wait 1-2 minutes** for changes to take effect

---

## 🔄 Step 4: Restart Server

After updating `.env` file:

```bash
# Stop current server
lsof -ti:3000 | xargs kill

# Start server with new Atlas connection
cd backend
npm run dev
```

You should see:

```
✅ MongoDB Connected: proget.bfcpim5.mongodb.net
📊 Database: proget
🚀 Server running on port 3000
```

---

## 📊 Step 5: Seed the Database

Since your Atlas database is empty, seed it with sample data:

```bash
cd backend
npm run seed
```

This creates:

- ✅ 1 sample user: `alex@example.com` / `password123`
- ✅ 5 sample events

---

## ✅ Step 6: Test Connection

```bash
# Test health check
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

---

## 🎯 Quick Checklist

- [ ] Updated `MONGODB_URI` in `backend/.env`
- [ ] Replaced `YOUR_PASSWORD_HERE` with actual password
- [ ] Whitelisted IP in Atlas (0.0.0.0/0)
- [ ] Waited 1-2 minutes after whitelisting
- [ ] Restarted server (`npm run dev`)
- [ ] Seeded database (`npm run seed`)
- [ ] Tested connection (curl commands)

---

## 🐛 Troubleshooting

### "MongoServerError: bad auth"

❌ **Problem:** Wrong password  
✅ **Solution:** Reset password in Atlas and update `.env`

### "Connection timeout" or "Could not connect"

❌ **Problem:** IP not whitelisted  
✅ **Solution:** Add 0.0.0.0/0 in Network Access, wait 2 minutes

### "Authentication failed"

❌ **Problem:** Forgot to replace `YOUR_PASSWORD_HERE`  
✅ **Solution:** Edit `.env` with real password

### Password has special characters

❌ **Problem:** Special characters like `@`, `#`, `$` in password  
✅ **Solution:** URL encode them or use simple password

---

## 📱 For React Native App

Your app will automatically connect to Atlas once backend is running!

**No changes needed** to React Native app - it connects to your backend at:

- Simulator: `http://localhost:3000/api`
- Physical device: `http://172.20.10.3:3000/api`

---

## 🌟 What You Get with Atlas

✅ **512 MB free storage** - Forever  
✅ **Always accessible** - From anywhere  
✅ **Automatic backups** - Data is safe  
✅ **No local MongoDB needed** - Works on any computer  
✅ **Production ready** - Real cloud database  
✅ **Team collaboration** - Everyone can connect

---

## 📚 Useful Links

- **Your Atlas Dashboard:** https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/overview
- **Database Users:** https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/security/database/users
- **Network Access:** https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/security/network/accessList
- **Browse Collections:** https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/clusters

---

## 📝 Your Connection String Template

**Copy this to your .env file:**

```
MONGODB_URI=mongodb+srv://vithyeass_db_user:YOUR_PASSWORD_HERE@proget.bfcpim5.mongodb.net/proget?retryWrites=true&w=majority&appName=proget
```

**Remember to:**

1. Replace `YOUR_PASSWORD_HERE` with your actual password
2. No spaces in the password
3. If password has special characters, URL encode them

---

**🎉 You're ready to use MongoDB Atlas! Follow the steps above to connect.**
