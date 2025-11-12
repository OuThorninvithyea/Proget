# 🔐 Authentication System - Complete Guide

## Overview

Your app now has a fully functional authentication system connected to MongoDB Atlas! Users can register, login, and logout with their data securely stored in the cloud database.

---

## ✅ Features

### **Login System** 🔑
- Email and password authentication
- Remember me (auto-login on app restart)
- Password visibility toggle
- Demo account credentials displayed
- Form validation
- Error handling

### **Registration System** 📝
- Create new accounts
- Full name, email, phone (optional), password
- Password confirmation
- Email validation
- Minimum password length (6 characters)
- Automatic login after registration

### **Session Management** 💾
- JWT tokens for authentication
- Secure token storage (AsyncStorage)
- Automatic session restoration
- Logout functionality

### **User Data** 👤
- User profile from MongoDB
- Display in Account screen
- Avatar, name, email, phone
- Member since date

---

## 🎯 How It Works

### **App Flow:**

```
1. App starts → Check if user is logged in
   ├─ NO → Show Login Screen
   │   ├─ Login → Authenticate with MongoDB
   │   │   └─ Success → Save token → Show App
   │   └─ Register → Create account → Save token → Show App
   └─ YES → Show App (HomeTabs)
```

### **Authentication Flow:**

```
User enters credentials
     ↓
LoginScreen / RegisterScreen
     ↓
authService.login() / authService.register()
     ↓
POST to MongoDB Atlas API
     ↓
Backend validates & returns JWT token
     ↓
AuthContext saves user & token
     ↓
App navigates to HomeTabs
```

---

## 🔐 Test Credentials

### **Demo Account (Already in Database):**

```
Email: alex@example.com
Password: password123
```

This account was created when you seeded the database!

---

## 📱 Using the Authentication

### **1. Login**

Open your app → You'll see the Login screen:

- **Email**: alex@example.com
- **Password**: password123
- Tap **"Sign In"**
- You're logged in! 🎉

### **2. Register New Account**

From Login screen:
- Tap **"Sign Up"**
- Fill in:
  - Full Name
  - Email
  - Phone (optional)
  - Password (min 6 characters)
  - Confirm Password
- Tap **"Create Account"**
- Account created & auto-logged in! 🎉

### **3. Logout**

From Account tab:
- Scroll to bottom
- Tap **"Logout"** button
- Confirm logout
- Redirected to Login screen

### **4. Auto-Login**

- Close app completely
- Reopen app
- **Automatically logged in** if you were previously signed in!

---

## 🛠️ Technical Details

### **Files Created:**

1. **`src/contexts/AuthContext.tsx`**
   - Authentication state management
   - Login/Register/Logout functions
   - User data storage
   - Token management

2. **`src/screens/LoginScreen.tsx`**
   - Login UI
   - Email/Password inputs
   - Form validation
   - Demo credentials display

3. **`src/screens/RegisterScreen.tsx`**
   - Registration UI
   - Full form with validation
   - Password confirmation
   - Auto-login after signup

### **Files Modified:**

1. **`src/navigation/RootNavigator.tsx`**
   - Added Login/Register routes
   - Conditional rendering (Auth vs App)
   - Loading state

2. **`src/App.tsx`**
   - Wrapped with AuthProvider
   - Provider order maintained

3. **`src/screens/AccountScreen.tsx`**
   - Uses authenticated user data
   - Functional logout button

---

## 🔒 Security Features

### **Password Security:**
✅ Passwords hashed with bcrypt (backend)  
✅ Never stored in plain text  
✅ Minimum 6 characters required  

### **Token Security:**
✅ JWT tokens with expiration (7 days)  
✅ Stored securely in AsyncStorage  
✅ Sent with every API request  

### **Data Validation:**
✅ Email format validation  
✅ Password strength requirements  
✅ Required field checking  
✅ Duplicate email prevention  

---

## 📊 Data Flow

### **Login:**
```typescript
User Input → LoginScreen
     ↓
authService.login({ email, password })
     ↓
API: POST /api/auth/login
     ↓
MongoDB validates credentials
     ↓
Returns: { user, token }
     ↓
Save to AsyncStorage
     ↓
Update AuthContext state
     ↓
Navigate to HomeTabs
```

### **Register:**
```typescript
User Input → RegisterScreen
     ↓
authService.register({ name, email, password })
     ↓
API: POST /api/auth/register
     ↓
MongoDB creates new user
     ↓
Returns: { user, token }
     ↓
Save to AsyncStorage
     ↓
Update AuthContext state
     ↓
Navigate to HomeTabs
```

### **Logout:**
```typescript
User confirms logout
     ↓
authContext.logout()
     ↓
Clear AsyncStorage (token & user)
     ↓
Update AuthContext state (null)
     ↓
Navigate to Login
```

---

## 🎨 UI/UX Features

### **Login Screen:**
- 🎫 App logo with accent color
- 📧 Email input with icon
- 🔒 Password input with show/hide toggle
- ℹ️ Demo credentials info box
- 🔗 Link to Register screen
- ⏳ Loading indicator during login

### **Register Screen:**
- 👤 Full name input
- 📧 Email input
- 📞 Phone input (optional)
- 🔒 Password inputs with validation
- 👁️ Password visibility toggle
- ⏳ Loading indicator during signup

### **Theme Support:**
- ✅ Full dark mode support
- ✅ Themed inputs and buttons
- ✅ Adaptive colors

---

## 🔧 API Endpoints Used

### **Login:**
```
POST http://localhost:3000/api/auth/login
Body: { email, password }
Response: { success, data: { user, token } }
```

### **Register:**
```
POST http://localhost:3000/api/auth/register
Body: { name, email, password, phone }
Response: { success, data: { user, token } }
```

---

## 🧪 Testing

### **Test Login:**
1. Open app
2. Enter: alex@example.com / password123
3. Tap Sign In
4. Should see HomeTabs

### **Test Register:**
1. Tap "Sign Up"
2. Enter details:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
3. Tap Create Account
4. Should auto-login and see HomeTabs

### **Test Logout:**
1. Go to Account tab
2. Scroll to bottom
3. Tap Logout
4. Confirm
5. Should see Login screen

### **Test Auto-Login:**
1. Login with credentials
2. Close app (swipe away)
3. Reopen app
4. Should automatically show HomeTabs (no login required)

---

## 🐛 Troubleshooting

### **"API request failed" error:**
- ✅ Check backend server is running: `npm run dev` in `/backend`
- ✅ Verify API_URL in `src/services/api.ts`
- ✅ Check MongoDB Atlas connection

### **"Invalid credentials" error:**
- ✅ Check email/password are correct
- ✅ Try demo account: alex@example.com / password123
- ✅ Verify user exists in MongoDB

### **"User already exists" error:**
- ✅ Email already registered
- ✅ Try logging in instead
- ✅ Or use a different email

### **Token expires:**
- ✅ Tokens last 7 days
- ✅ After expiration, user must login again
- ✅ This is normal security behavior

### **Auto-login not working:**
- ✅ Check AsyncStorage permissions
- ✅ Token might be expired
- ✅ Try logging in again

---

## 📚 Code Examples

### **Using Auth in Components:**

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Text>Please login</Text>;
  }
  
  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

### **Protected API Calls:**

```typescript
import api from '../services/api';

// Token is automatically included from AsyncStorage
const tickets = await api.get('/tickets?userId=' + userId);
```

---

## 🎯 Features You Get

✅ **Secure Authentication** - JWT tokens + password hashing  
✅ **User Registration** - Create new accounts  
✅ **Session Management** - Remember me functionality  
✅ **Auto-Login** - Seamless app restart experience  
✅ **User Profiles** - Display user data from MongoDB  
✅ **Logout** - Clear session and redirect to login  
✅ **Form Validation** - Email, password strength  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Visual feedback during API calls  
✅ **Dark Mode** - Fully themed authentication screens  

---

## 🚀 What's Next?

Now that you have authentication, you can:

1. **Add Real Ticket Purchases** - Link to authenticated user
2. **User-Specific Data** - Show only user's tickets/orders
3. **Profile Editing** - Update user info in MongoDB
4. **Password Reset** - Forgot password functionality
5. **Email Verification** - Verify user emails
6. **Social Login** - Google/Facebook authentication
7. **Role-Based Access** - Admin vs regular users

---

## 📖 Related Documentation

- **API Documentation**: `backend/README.md`
- **MongoDB Setup**: `MONGODB_ATLAS_SETUP.md`
- **Account Features**: `ACCOUNT_FEATURES.md`

---

## ✨ Summary

Your app now has **production-ready authentication** with:
- ✅ Login & Registration screens
- ✅ MongoDB Atlas backend
- ✅ JWT token security
- ✅ Session persistence
- ✅ User profile data
- ✅ Logout functionality
- ✅ Full dark mode support

**Test it now:** Open your app and login with `alex@example.com` / `password123`! 🎉

