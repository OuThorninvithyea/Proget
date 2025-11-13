# 🚀 Forgot Password - Quick Start Guide

## ✅ Status: Implementation Complete!

Your forgot password feature is **fully implemented**. Just follow these 3 steps to make it work:

---

## Step 1: Configure Email (2 minutes)

### Option A: Mailtrap (Easiest for Testing) ⭐

1. Go to [mailtrap.io](https://mailtrap.io/) and sign up (free)
2. Create an inbox
3. Copy your SMTP credentials
4. Add to `/backend/.env`:

```env
# Add these lines to your .env file:
FRONTEND_URL=http://localhost:3000

# Mailtrap credentials (get these from mailtrap.io)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
FROM_NAME=ProGet
FROM_EMAIL=noreply@proget.com
```

### Option B: Gmail (For Production)

```env
FRONTEND_URL=https://your-app.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password  # Not your regular password!
FROM_NAME=ProGet
FROM_EMAIL=your_gmail@gmail.com
```

**Note**: For Gmail, you need to:

1. Enable 2-Factor Authentication
2. Generate an "App Password" (Google Account → Security → App Passwords)

---

## Step 2: Test It (1 minute)

### A. Start your backend server:

```bash
cd backend
npm run dev
```

### B. Test with curl:

```bash
# Request password reset (use a real email from your database)
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### C. Or use the test script:

```bash
cd backend
node test-forgot-password.js
```

### D. Check your email:

- **Mailtrap**: Go to your Mailtrap inbox
- **Gmail**: Check your inbox

---

## Step 3: Add Frontend Screen (Optional)

### For React Native:

1. Create `rn-app/src/screens/ForgotPasswordScreen.tsx`:

```typescript
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });

      Alert.alert(
        "Success!",
        "If an account exists with this email, you will receive password reset instructions shortly.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email and we'll send you instructions to reset your password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    padding: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
```

2. Add to your navigation (`rn-app/src/navigation/RootNavigator.tsx`):

```typescript
<Stack.Screen
  name="ForgotPassword"
  component={ForgotPasswordScreen}
  options={{
    title: "Forgot Password",
    headerBackTitle: "Back",
  }}
/>
```

3. Update your LoginScreen to add the link:

```typescript
// In your LoginScreen, add this after the password input:
<TouchableOpacity
  onPress={() => navigation.navigate("ForgotPassword")}
  style={{ alignSelf: "flex-end", marginBottom: 20 }}
>
  <Text style={{ color: "#007AFF", fontSize: 14 }}>Forgot Password?</Text>
</TouchableOpacity>
```

---

## 🧪 Testing Checklist

Test these scenarios:

- [ ] Enter valid email → Receive email with reset link
- [ ] Enter invalid email → Still get success message (security)
- [ ] Click reset link → Token is valid
- [ ] Wait 11 minutes → Token expires
- [ ] Reset with weak password → Validation error
- [ ] Password and confirm don't match → Validation error
- [ ] Successful reset → Can login with new password
- [ ] Try to reuse token → Shows expired/invalid

---

## 📋 API Endpoints Summary

### Request Password Reset

```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

### Reset Password

```
PUT /api/auth/reset-password/:token
Body: {
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

---

## 🔍 Troubleshooting

### "Email could not be sent"

1. Check your `.env` file has SMTP credentials
2. Restart your backend server after adding credentials
3. Check console for detailed error messages
4. Test SMTP credentials in an email client first

### "Invalid or expired reset token"

- Tokens expire after 10 minutes
- Tokens can only be used once
- Check that the token in URL matches the one in email

### No email received (Mailtrap)

- Mailtrap is fake SMTP - emails stay in Mailtrap inbox
- Login to mailtrap.io to see captured emails
- Check you're using correct inbox credentials

### Gmail not working

- Use App Password, not your regular password
- Enable 2-Factor Authentication first
- Allow "Less secure app access" (if needed)

---

## 🎯 What Happens Behind the Scenes

1. **User requests reset**:

   - User enters email
   - System generates secure random token
   - Token is hashed and stored in database
   - Email sent with unhashed token in URL
   - Token expires in 10 minutes

2. **User clicks link**:

   - Token from URL is hashed
   - Compared with stored hashed token
   - If valid and not expired, allow password reset

3. **User sets new password**:
   - New password is validated
   - Password is hashed (bcrypt)
   - Reset token is cleared from database
   - Confirmation email sent
   - User can now login with new password

---

## 🔐 Security Features

- ✅ Tokens are cryptographically secure (32 bytes)
- ✅ Tokens are hashed in database (SHA-256)
- ✅ Tokens expire after 10 minutes
- ✅ Tokens are single-use only
- ✅ Generic responses (doesn't reveal if email exists)
- ✅ Password requirements enforced (8+ chars, uppercase, lowercase, number)
- ✅ Passwords hashed with bcrypt (8 rounds)
- ✅ Email confirmation after successful reset

---

## 📞 Need Help?

Check the full documentation: `FORGOT_PASSWORD_SETUP.md`

Or test with: `node backend/test-forgot-password.js`

---

**That's it! Your forgot password feature is ready to use! 🎉**
