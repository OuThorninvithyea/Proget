# Forgot Password Feature - Setup Guide

✅ **Your forgot password feature is now fully implemented and ready to use!**

## 📋 What's Already Implemented

Your backend includes a complete forgot password flow:

1. **POST /api/auth/forgot-password** - Request password reset
2. **PUT /api/auth/reset-password/:resetToken** - Reset password with token
3. Email sending with HTML templates
4. Secure token generation with 10-minute expiration
5. Input validation
6. Security best practices

## 🚀 Setup Instructions

### Step 1: Configure Email Service (Choose One Option)

#### Option A: Mailtrap (Recommended for Development/Testing)

Mailtrap is a fake SMTP server that catches all emails - perfect for testing!

1. Go to [mailtrap.io](https://mailtrap.io/) and create a free account
2. In your inbox, click on "Show Credentials"
3. Copy the SMTP credentials
4. Update your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username_here
SMTP_PASS=your_mailtrap_password_here
FROM_NAME=ProGet
FROM_EMAIL=noreply@proget.com

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

#### Option B: Gmail (For Production)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate new app password
3. Update your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
FROM_NAME=ProGet
FROM_EMAIL=your_email@gmail.com
FRONTEND_URL=https://your-production-url.com
```

#### Option C: SendGrid (For Production)

1. Sign up at [sendgrid.com](https://sendgrid.com/)
2. Create an API key
3. Update your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
FROM_NAME=ProGet
FROM_EMAIL=verified_sender@yourdomain.com
FRONTEND_URL=https://your-production-url.com
```

### Step 2: Test the Backend

#### Test 1: Request Password Reset

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

If using Mailtrap, check your inbox for the email!

#### Test 2: Reset Password

Copy the reset token from the email or development response, then:

```bash
curl -X PUT http://localhost:3000/api/auth/reset-password/YOUR_TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

## 📱 Frontend Integration

### For React Native App

Create a forgot password screen:

```typescript
// rn-app/src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../services/api';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Password reset instructions have been sent to your email',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title={loading ? "Sending..." : "Send Reset Link"}
        onPress={handleForgotPassword}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
});
```

Add the screen to your navigation:

```typescript
// rn-app/src/navigation/RootNavigator.tsx
<Stack.Screen 
  name="ForgotPassword" 
  component={ForgotPasswordScreen}
  options={{ title: 'Forgot Password' }}
/>
```

Update your login screen to include a "Forgot Password?" link:

```typescript
// In LoginScreen.tsx
<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
  <Text style={styles.forgotPassword}>Forgot Password?</Text>
</TouchableOpacity>
```

### For Web App

The reset link will direct users to your frontend URL with the token:
```
http://localhost:3000/reset-password/TOKEN_HERE
```

Create a reset password page that:
1. Extracts the token from the URL
2. Shows a form with password and confirm password fields
3. Sends PUT request to `/api/auth/reset-password/:token`

## 🔒 Security Features

Your implementation includes:

- ✅ Tokens are hashed before storage (SHA-256)
- ✅ Tokens expire after 10 minutes
- ✅ Tokens are single-use only
- ✅ Password requirements: min 8 chars, uppercase, lowercase, number
- ✅ Generic response messages (doesn't reveal if email exists)
- ✅ Confirmation email after successful reset
- ✅ Input validation with express-validator

## 🧪 Testing Checklist

- [ ] Email is received with reset link
- [ ] Reset link expires after 10 minutes
- [ ] Invalid token shows error message
- [ ] Weak passwords are rejected
- [ ] Password mismatch is caught
- [ ] User can login with new password
- [ ] Token cannot be reused after password reset
- [ ] Confirmation email is sent after reset

## 🐛 Troubleshooting

### Email not sending?

1. **Check .env file**: Make sure it's in `/backend/.env` (not `env.template`)
2. **Verify SMTP credentials**: Test them in an email client
3. **Check console logs**: Look for error messages
4. **Firewall issues**: Some networks block SMTP ports
5. **Gmail specific**: Make sure you're using App Password, not regular password

### Token expired immediately?

- Check server time is correct
- Verify `resetPasswordExpire` is being set (10 minutes from now)

### Frontend URL wrong in emails?

- Update `FRONTEND_URL` in `.env` file
- For React Native, you might want to use a deep link scheme

## 📝 API Documentation

### POST /api/auth/forgot-password

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

### PUT /api/auth/reset-password/:resetToken

**Request:**
```json
{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    },
    "token": "jwt_token"
  }
}
```

## 🎉 Next Steps

1. Configure email service (Mailtrap for testing)
2. Update your `.env` file with SMTP credentials
3. Test the endpoints using curl or Postman
4. Implement the frontend screens
5. Test the complete flow
6. Deploy to production with real email service

---

**Note**: In development mode, the API response includes the reset token for easy testing. This is removed in production for security.

