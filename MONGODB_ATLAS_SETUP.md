# 🌐 MongoDB Atlas Cloud Setup

## Connect to Your MongoDB Atlas Account

You have a MongoDB Atlas cloud account. Here's how to connect it to your app:

---

## 📋 Step-by-Step Guide

### Step 1: Get Your Connection String

1. **Visit your MongoDB Atlas dashboard:**
   https://cloud.mongodb.com/v2/691365e14a4f313b3c9f655f#/overview

2. **Click "Connect" button** on your cluster (usually named Cluster0)

3. **Select "Drivers"** as the connection method

4. **Copy the connection string** - it will look like:

   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Important**: Replace `<password>` with your actual database password

   - **NOT your Atlas account password**
   - This is the database user password you created when setting up

6. **Add database name** before the `?`:
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/proget?retryWrites=true&w=majority
   ```
   ⬆️ Notice we added `/proget` before the `?`

---

### Step 2: Whitelist Your IP Address

**IMPORTANT**: Atlas blocks all IPs by default for security

1. In Atlas dashboard, click **"Network Access"** (left sidebar under Security)

2. Click **"Add IP Address"** button

3. Choose one option:

   - **For Development**: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **For Production**: Click **"Add Current IP Address"**

4. Click **"Confirm"**

5. **Wait 1-2 minutes** for changes to take effect

---

### Step 3: Update Your Backend Configuration

**Option A: Manual Update (Easy)**

1. Open `backend/.env` file

2. Replace the `MONGODB_URI` line with your Atlas connection string:

```env
# MongoDB Configuration - ATLAS CLOUD
MONGODB_URI=mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/proget?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=proget_jwt_secret_key_2025_change_in_production
JWT_EXPIRE=7d

# API Version
API_VERSION=v1
```

**Option B: Terminal Command**

Run this command (replace with YOUR connection string):

```bash
cd backend
cat > .env << 'EOF'
# MongoDB Configuration - ATLAS CLOUD
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/proget?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=proget_jwt_secret_key_2025_change_in_production
JWT_EXPIRE=7d

# API Version
API_VERSION=v1
EOF
```

---

### Step 4: Restart Your Backend Server

```bash
# Stop current server
lsof -ti:3000 | xargs kill

# Start again
cd backend
npm run dev
```

You should see:

```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
📊 Database: proget
🚀 Server running on port 3000
```

---

### Step 5: Re-seed Database

Since you're now using Atlas (which is empty), seed it again:

```bash
cd backend
npm run seed
```

This will create:

- 1 sample user (alex@example.com / password123)
- 5 sample events

---

## ✅ Verify Connection

### Test Health Check:

```bash
curl http://localhost:3000/api/health
```

### Test Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

### Check Database:

```bash
mongosh "mongodb+srv://YOUR_CONNECTION_STRING"
use proget
db.events.find()
```

---

## 🎯 Benefits of MongoDB Atlas

✅ **Always Available** - Access from anywhere  
✅ **No Local Setup** - Works on any computer  
✅ **Automatic Backups** - Data is safe  
✅ **Free Tier** - 512MB storage free forever  
✅ **Real Cloud Database** - Production-ready  
✅ **Better for Teams** - Everyone can connect

---

## 🔒 Security Best Practices

### For Development:

✅ Use IP whitelist: 0.0.0.0/0 (allow all)  
✅ Use strong database user password  
✅ Don't commit `.env` file to git

### For Production:

✅ Restrict IP addresses  
✅ Use environment variables  
✅ Enable encryption  
✅ Regular backups  
✅ Monitor access logs

---

## 📊 View Your Data

### MongoDB Compass:

1. Download: https://www.mongodb.com/products/compass
2. Connect using your Atlas connection string
3. Browse collections visually

### Atlas Web Interface:

1. Go to your cluster
2. Click **"Browse Collections"**
3. View data directly in browser

### VS Code Extension:

1. Install "MongoDB for VS Code"
2. Connect using connection string
3. Browse in VS Code sidebar

---

## 🐛 Troubleshooting

### Error: "Connection refused" or "Authentication failed"

**Solutions:**

- ✅ Check your password is correct
- ✅ Replace `<password>` in connection string
- ✅ Check database user exists (Database Access in Atlas)
- ✅ Ensure IP is whitelisted (Network Access in Atlas)

### Error: "MongoServerError: bad auth"

**Solution:**

- Your password is wrong
- Go to Database Access → Edit User → Reset Password
- Update `.env` file with new password

### Error: "Could not connect to any servers"

**Solutions:**

- ✅ Check internet connection
- ✅ Verify IP is whitelisted
- ✅ Wait 1-2 minutes after whitelisting IP
- ✅ Check connection string format

### Connection works locally but not from phone:

**Solution:**

- Your phone's IP also needs to be whitelisted
- Easiest: Use 0.0.0.0/0 (allow all IPs)

---

## 📝 Connection String Format

### Correct Format:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proget?retryWrites=true&w=majority
```

### Common Mistakes:

❌ `mongodb+srv://username:<password>@...` - Forgot to replace `<password>`  
❌ `mongodb+srv://username:pass@word@...` - Special characters in password (URL encode them)  
❌ `mongodb+srv://...net/?retryWrites...` - Missing database name (`/proget`)  
❌ `mongodb://...` - Wrong protocol (should be `mongodb+srv://`)

---

## 🎉 Quick Reference

### Get Connection String:

1. Atlas Dashboard → Connect → Drivers
2. Copy connection string
3. Replace `<password>` with actual password
4. Add `/proget` before `?`

### Update Backend:

```bash
# Edit backend/.env file
# Replace MONGODB_URI line with Atlas connection string
```

### Restart Server:

```bash
cd backend
npm run dev
```

### Seed Database:

```bash
cd backend
npm run seed
```

---

## 🌟 You're Now Using Cloud Database!

Your app is now connected to a real cloud database that:

- ✅ Works from anywhere
- ✅ Persists data forever
- ✅ Scales automatically
- ✅ Has automatic backups

This is **production-ready**! 🚀

---

**Next Step:** Update your `.env` file with your Atlas connection string and restart the server!
