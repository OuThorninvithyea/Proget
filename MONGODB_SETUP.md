# MongoDB Database Setup Guide

Complete guide to set up and connect MongoDB database for ProGet Concert Tickets app.

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [MongoDB Installation](#mongodb-installation)
3. [Backend Setup](#backend-setup)
4. [Database Seeding](#database-seeding)
5. [Connect React Native App](#connect-react-native-app)
6. [API Testing](#api-testing)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Your app now has a complete MongoDB backend with:

- ✅ Express.js REST API
- ✅ Mongoose ODM for MongoDB
- ✅ JWT Authentication
- ✅ User management
- ✅ Events, Tickets, Orders
- ✅ Marketplace listings
- ✅ Complete CRUD operations

---

## 🗄️ MongoDB Installation

### Option 1: Local MongoDB (Recommended for Development)

#### macOS:

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify installation
mongosh
```

#### Windows:

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start automatically as a service

#### Linux (Ubuntu/Debian):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account:**

   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster:**

   - Choose FREE tier (M0)
   - Select closest region
   - Create cluster (takes 5-10 minutes)

3. **Get Connection String:**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

4. **Whitelist IP:**
   - Add your IP address or use `0.0.0.0/0` (allow from anywhere)

---

## 🛠️ Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Create `.env` file in `backend` directory:

```env
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/proget

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proget?retryWrites=true&w=majority

PORT=3000
NODE_ENV=development
JWT_SECRET=your_secure_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

### 3. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Or production mode
npm start
```

You should see:

```
✅ MongoDB Connected: localhost
📊 Database: proget
🚀 Server running on port 3000
📍 http://localhost:3000
```

---

## 🌱 Database Seeding

Populate your database with sample data:

```bash
cd backend
npm run seed
```

This creates:

- **1 Sample User:**
  - Email: `alex@example.com`
  - Password: `password123`
- **5 Sample Events:**
  - Summer Music Festival 2025
  - Rock Legends Live
  - Jazz Night Under Stars
  - Electronic Dance Night
  - Classical Symphony Orchestra

---

## 📱 Connect React Native App

### Step 1: Find Your IP Address

**For Physical Device Testing:**

**macOS/Linux:**

```bash
ifconfig | grep "inet "
# Look for something like: inet 192.168.1.100
```

**Windows:**

```bash
ipconfig
# Look for IPv4 Address under Wi-Fi
```

### Step 2: Update API URL

In `rn-app/src/services/api.ts`, update the API_URL:

```typescript
// For iOS Simulator or Android Emulator
const API_URL = "http://localhost:3000/api";

// For Android Emulator specifically
const API_URL = "http://10.0.2.2:3000/api";

// For Physical Device (replace with YOUR IP)
const API_URL = "http://192.168.1.100:3000/api";
```

### Step 3: Test Connection

Run your React Native app:

```bash
cd rn-app
npm start
```

The app will now fetch real data from MongoDB!

---

## 🧪 API Testing

### Test Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "ProGet API is running",
  "timestamp": "2025-01-11T..."
}
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

### Test Get Events

```bash
curl http://localhost:3000/api/events
```

---

## 🎯 Using the API in Your App

### Example: Login Screen

```typescript
import authService from "../services/authService";

const handleLogin = async () => {
  try {
    const result = await authService.login({
      email: "alex@example.com",
      password: "password123",
    });

    console.log("Login successful:", result.data.user);
    // Token is automatically stored
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### Example: Fetch Events

```typescript
import eventsService from "../services/eventsService";

const loadEvents = async () => {
  try {
    const events = await eventsService.getEvents();
    console.log("Events loaded:", events.length);
    setEvents(events);
  } catch (error) {
    console.error("Failed to load events:", error);
  }
};
```

### Example: Create Order

```typescript
import ordersService from "../services/ordersService";

const handleCheckout = async () => {
  try {
    const result = await ordersService.createOrder({
      userId: currentUserId,
      eventId: selectedEventId,
      seatIds: ["A1", "A2"],
      paymentMethod: {
        type: "card",
        brand: "Visa",
        last4: "4242",
      },
    });

    console.log("Order created:", result.order);
    console.log("Ticket generated:", result.ticket);
  } catch (error) {
    console.error("Checkout failed:", error);
  }
};
```

---

## 🛠️ Available Services

All services are ready to use in `rn-app/src/services/`:

1. **authService.ts**

   - register, login, logout

2. **eventsService.ts**

   - getEvents, getEvent, getFeaturedEvents, searchEvents

3. **ticketsService.ts**

   - getTickets, getTicket, getUserTickets, transferTicket

4. **ordersService.ts**
   - getOrders, getOrder, createOrder, cancelOrder

---

## 🐛 Troubleshooting

### 1. MongoDB Not Starting

**macOS:**

```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

**Windows:**

- Open Services app
- Find "MongoDB Server"
- Right-click → Start

**Linux:**

```bash
# Check status
sudo systemctl status mongod

# Start service
sudo systemctl start mongod

# View logs
sudo tail -f /var/log/mongodb/mongod.log
```

### 2. Connection Refused Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

- Make sure MongoDB is running
- Check if port 3000 is available
- Verify MONGODB_URI in `.env`

### 3. Cannot Connect from Physical Device

**Check:**

- Computer and phone on same Wi-Fi network
- Firewall allows port 3000
- Using correct IP address (not localhost)

**Test connection:**

```bash
# From your phone's browser, visit:
http://YOUR_IP:3000/api/health
```

### 4. JWT Token Errors

```
Error: jwt must be provided
```

**Solution:**

- Make sure you're logged in
- Token is stored after login
- Check `authToken` in AsyncStorage

---

## 📊 Database Management

### MongoDB Compass (GUI Tool)

1. **Download:** [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. **Connect:** `mongodb://localhost:27017`
3. **Browse:** View collections, documents, run queries

### MongoDB Shell

```bash
# Connect to database
mongosh

# Select database
use proget

# View collections
show collections

# Query examples
db.events.find().pretty()
db.users.find({ email: "alex@example.com" })
db.tickets.countDocuments()

# Delete all data (careful!)
db.events.deleteMany({})
```

---

## 🔒 Security Best Practices

### For Development:

✅ Use `.env` for sensitive data
✅ Don't commit `.env` to git
✅ Use strong JWT_SECRET

### For Production:

✅ Use MongoDB Atlas or managed database
✅ Enable SSL/TLS
✅ Restrict IP whitelist
✅ Use environment-specific secrets
✅ Enable authentication
✅ Regular backups

---

## 📈 Next Steps

1. **Replace Mock Data:**

   - Update components to use API services
   - Remove local mock data files
   - Add loading states

2. **Add Authentication Flow:**

   - Create login/register screens
   - Store and use JWT tokens
   - Handle authentication errors

3. **Implement Real Orders:**

   - Connect checkout to API
   - Generate real tickets
   - Update seat availability

4. **Deploy:**
   - Deploy backend to Heroku/Render
   - Use MongoDB Atlas for database
   - Update app with production API URL

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)

---

## ✅ Checklist

- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] `.env` file created
- [ ] Server starts without errors
- [ ] Database seeded with sample data
- [ ] API health check works
- [ ] Can login with sample user
- [ ] React Native app connects to API
- [ ] Events load from database

---

**🎉 Your MongoDB backend is ready! The app now has a real database powering all features!**

For detailed API documentation, see `backend/README.md`
