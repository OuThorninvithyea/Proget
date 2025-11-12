# ProGet Backend API - MongoDB Integration

Complete backend API for ProGet Concert Tickets app with MongoDB database integration.

## 🚀 Features

- ✅ MongoDB database with Mongoose ODM
- ✅ RESTful API with Express.js
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Complete CRUD operations for:
  - Users & Authentication
  - Events & Concerts
  - Tickets & Orders
  - Marketplace Listings
- ✅ Database seeding script
- ✅ Error handling & validation
- ✅ CORS enabled for React Native

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas account)
- **npm** or **yarn**

---

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/proget
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proget?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_change_this
JWT_EXPIRE=7d
```

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

**Install MongoDB:**

- **macOS:** `brew install mongodb-community`
- **Windows:** Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Linux:** Follow [official docs](https://docs.mongodb.com/manual/administration/install-on-linux/)

**Start MongoDB:**

```bash
# macOS/Linux
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/data
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env` file

---

## 🌱 Seed Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:

- **1 sample user:**
  - Email: `alex@example.com`
  - Password: `password123`
- **5 sample events** (concerts, festivals)

---

## 🚀 Running the Server

### Development Mode (with auto-restart):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

Server will run on: `http://localhost:3000`

---

## 📡 API Endpoints

### 🔐 Authentication

```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
```

### 👤 Users

```
GET    /api/users/:id        Get user profile
PUT    /api/users/:id        Update user profile
PUT    /api/users/:id/settings    Update settings (language, theme, privacy)
DELETE /api/users/:id        Delete user account
```

### 🎉 Events

```
GET    /api/events           Get all events (with filters)
GET    /api/events/:id       Get single event
POST   /api/events           Create event (admin)
PUT    /api/events/:id       Update event (admin)
DELETE /api/events/:id       Delete event (admin)
POST   /api/events/:id/book-seats    Book seats
```

### 🎫 Tickets

```
GET    /api/tickets          Get all tickets (with filters)
GET    /api/tickets/:id      Get single ticket
POST   /api/tickets          Create ticket
PUT    /api/tickets/:id/transfer     Transfer ticket
PUT    /api/tickets/:id/use  Mark ticket as used
```

### 📦 Orders

```
GET    /api/orders           Get all orders (with filters)
GET    /api/orders/:id       Get single order
POST   /api/orders           Create order
PUT    /api/orders/:id/cancel        Cancel order
```

### 🏪 Marketplace Listings

```
GET    /api/listings         Get all listings
GET    /api/listings/:id     Get single listing
POST   /api/listings         Create listing
PUT    /api/listings/:id     Update listing
DELETE /api/listings/:id     Cancel listing
POST   /api/listings/:id/purchase    Purchase listing
```

---

## 📚 Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  bio: String,
  avatar: String,
  language: 'en' | 'km',
  theme: 'light' | 'dark' | 'system',
  memberSince: Date,
  privacySettings: Object,
  notificationSettings: Object,
}
```

### Event Model

```javascript
{
  name: String,
  artist: String,
  date: String,
  time: String,
  venue: String,
  location: String,
  image: String,
  price: Number,
  category: String,
  description: String,
  badges: [String],
  totalSeats: Number,
  availableSeats: Number,
  seatLayout: { rows, cols },
  takenSeats: [String],
  status: 'upcoming' | 'live' | 'completed' | 'cancelled',
  isFeatured: Boolean,
}
```

### Ticket Model

```javascript
{
  ticketId: String (unique),
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  orderId: ObjectId (ref: Order),
  seatIds: [String],
  quantity: Number,
  price: Number,
  total: Number,
  status: 'active' | 'used' | 'cancelled' | 'transferred',
  qrCode: String,
  purchasedAt: Date,
}
```

### Order Model

```javascript
{
  orderId: String (unique),
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  seatIds: [String],
  quantity: Number,
  subtotal: Number,
  fees: { serviceFee, processingFee },
  total: Number,
  paymentMethod: Object,
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded',
  paidAt: Date,
}
```

### Listing Model (Marketplace)

```javascript
{
  listingId: String (unique),
  sellerId: ObjectId (ref: User),
  ticketId: ObjectId (ref: Ticket),
  eventId: ObjectId (ref: Event),
  listingType: 'sale' | 'trade' | 'both',
  price: Number,
  tradePreferences: Object,
  description: String,
  status: 'active' | 'pending' | 'sold' | 'traded' | 'cancelled',
  expiresAt: Date,
  views: Number,
}
```

---

## 🧪 Testing API Endpoints

### Using cURL:

**Register:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

**Get Events:**

```bash
curl http://localhost:3000/api/events
```

### Using Postman or Insomnia:

1. Import the API endpoints
2. Set base URL: `http://localhost:3000/api`
3. For authenticated requests, add header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

---

## 🔗 Connecting React Native App

### 1. Update API URL

In `rn-app/src/services/api.ts`:

```typescript
// For local development with emulator/simulator
const API_URL = "http://localhost:3000/api";

// For physical device, use your computer's IP address
const API_URL = "http://192.168.1.XXX:3000/api";

// For production
const API_URL = "https://your-api.com/api";
```

### 2. Find Your IP Address

**macOS/Linux:**

```bash
ifconfig | grep "inet "
```

**Windows:**

```bash
ipconfig
```

Look for your local IP address (e.g., 192.168.1.100)

### 3. Use Services in Components

```typescript
import eventsService from "../services/eventsService";
import authService from "../services/authService";

// Get events
const events = await eventsService.getEvents();

// Login
const result = await authService.login({ email, password });
```

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables for sensitive data
- ✅ CORS configuration

---

## 📝 Environment Variables Reference

| Variable      | Description                          | Default                            |
| ------------- | ------------------------------------ | ---------------------------------- |
| `MONGODB_URI` | MongoDB connection string            | `mongodb://localhost:27017/proget` |
| `PORT`        | Server port                          | `3000`                             |
| `NODE_ENV`    | Environment (development/production) | `development`                      |
| `JWT_SECRET`  | Secret key for JWT                   | Required                           |
| `JWT_EXPIRE`  | JWT expiration time                  | `7d`                               |

---

## 🐛 Troubleshooting

### MongoDB Connection Issues:

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running:

```bash
brew services list
# or
mongod --dbpath /path/to/data
```

### Port Already in Use:

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Change PORT in `.env` or kill the process:

```bash
lsof -ti:3000 | xargs kill
```

### JWT Errors:

```
Error: jwt malformed
```

**Solution:** Make sure you're sending the correct token format:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📊 Database Tools

### MongoDB Compass (GUI)

- Download: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connect to: `mongodb://localhost:27017`
- View and manage your data visually

### MongoDB Shell

```bash
mongosh
use proget
db.events.find()
db.users.find()
```

---

## 🚀 Deployment

### Deploy to Heroku:

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create proget-api

# Add MongoDB Atlas add-on or use external MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Deploy to Render, Railway, or DigitalOcean:

Follow their respective deployment guides. Make sure to:

1. Set all environment variables
2. Use MongoDB Atlas for database
3. Update CORS settings for your domain

---

## 📦 Package Dependencies

```json
{
  "express": "Server framework",
  "mongoose": "MongoDB ODM",
  "cors": "Enable CORS",
  "dotenv": "Environment variables",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "express-validator": "Input validation",
  "nodemon": "Auto-restart (dev)"
}
```

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section
2. Review API documentation
3. Check MongoDB connection
4. Verify environment variables

---

**🎉 Your backend is ready! Start the server and connect your React Native app!**
