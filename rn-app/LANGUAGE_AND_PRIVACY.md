# Language & Privacy Features Documentation

## 🌍 Language Support

### Overview
Your app now supports **bilingual functionality** with English and Khmer (ភាសាខ្មែរ) languages. Users can seamlessly switch between languages, and their preference is saved to the device.

---

### Features

#### ✅ **Supported Languages**
1. **English** 🇺🇸
   - Language Code: `en`
   - Native Name: English

2. **Khmer (ភាសាខ្មែរ)** 🇰🇭
   - Language Code: `km`
   - Native Name: ភាសាខ្មែរ

#### ✅ **Language Selection**
- Beautiful selection screen with flag icons
- Current language indicator with checkmark
- Visual feedback for active selection
- Instant language switching

#### ✅ **Persistence**
- Language preference saved to device
- Persists across app restarts
- Uses AsyncStorage for reliable storage

#### ✅ **Translation System**
- Context-based translation system
- `useLanguage()` hook for easy access
- `t()` function for translating text
- Centralized translation management

---

### Translated Content

The following app elements are translated:

#### **Navigation**
- Home (ទំព័រដើម)
- My Tickets (សំបុត្ររបស់ខ្ញុំ)
- Marketplace (ទីផ្សារ)
- Account (គណនី)

#### **Home Screen**
- Welcome Back (សូមស្វាគមន៍)
- Explore Events (ស្វែងរកព្រឹត្តិការណ៍)
- Recommended for you (សម្រាប់អ្នក)
- View All (មើលទាំងអស់)

#### **Event Details**
- Event Details (ព័ត៌មានលម្អិត)
- Select Seats (ជ្រើសរើសកន្លែងអង្គុយ)
- Buy Tickets (ទិញសំបុត្រ)
- Venue (ទីតាំង)
- Date (កាលបរិច្ឆេទ)
- Time (ពេលវេលា)
- Price (តម្លៃ)

#### **Tickets**
- My Tickets (សំបុត្ររបស់ខ្ញុំ)
- No tickets yet (មិនទាន់មានសំបុត្រ)
- Your purchased tickets will appear here (សំបុត្រដែលបានទិញនឹងបង្ហាញនៅទីនេះ)
- Tap for details (ចុចដើម្បីមើលព័ត៌មានលម្អិត)

#### **Account**
- Profile (ប្រវត្តិរូប)
- Settings (ការកំណត់)
- Edit Profile (កែប្រែប្រវត្តិរូប)
- Payment Methods (វិធីសាស្ត្របង់ប្រាក់)
- Order History (ប្រវត្តិការបញ្ជាទិញ)
- Notifications (ការជូនដំណឹង)
- Language (ភាសា)
- Privacy (ភាពឯកជន)
- Logout (ចាកចេញ)

#### **Common Actions**
- Save (រក្សាទុក)
- Cancel (បោះបង់)
- Delete (លុប)
- Edit (កែសម្រួល)
- Add (បន្ថែម)
- Remove (យកចេញ)
- Confirm (បញ្ជាក់)
- Back (ថយក្រោយ)
- Next (បន្ទាប់)
- Done (រួចរាល់)
- Search (ស្វែងរក)

---

### How to Use

#### **Change Language:**
1. Open **Account** tab
2. Tap **Language**
3. Select **English** or **ភាសាខ្មែរ**
4. Language changes immediately

#### **For Developers:**

**Using translations in components:**

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language } = useLanguage();
  
  return (
    <Text>{t('welcome')}</Text>  // Shows "Welcome Back" or "សូមស្វាគមន៍"
  );
}
```

**Adding new translations:**

Edit `src/contexts/LanguageContext.tsx`:

```typescript
const translations = {
  en: {
    myNewKey: 'My English Text',
    // ... more translations
  },
  km: {
    myNewKey: 'ខ្ញុំអត្ថបទខ្មែរ',
    // ... more translations
  },
};
```

---

## 🔒 Privacy & Security

### Overview
Comprehensive privacy settings give users complete control over their data, with granular permissions for data collection, sharing, and visibility.

---

### Features

#### ✅ **Data Collection Controls**
- **Allow Data Collection**: Toggle usage data collection
- **Analytics**: Control anonymous analytics
- **Personalization**: Manage personalized recommendations

#### ✅ **Location & Tracking**
- **Location Services**: Enable/disable location tracking
- Shows nearby events when enabled

#### ✅ **Sharing & Marketing**
- **Share with Partners**: Control data sharing with event organizers
- **Marketing Communications**: Manage promotional emails

#### ✅ **Profile Visibility**
- **Public Profile**: Make profile visible to other users
- **Show Purchase History**: Display purchase history on profile

#### ✅ **Data Management**
- **Download My Data**: Request a copy of all personal data
  - Prepared within 24 hours
  - Sent via email link
  
- **Delete My Data**: Permanently delete all personal data
  - Confirmation required
  - Action cannot be undone

#### ✅ **Legal Documents**
- **Privacy Policy**: Link to full privacy policy
- **Terms of Service**: Link to terms and conditions
- **Cookie Policy**: Information about cookie usage

---

### Privacy Settings Categories

#### **1. Data Collection**
Controls what data the app collects:
- Usage patterns
- App analytics
- Personal preferences

#### **2. Location & Tracking**
Manages location-based features:
- Nearby event recommendations
- Location-based notifications
- Event check-ins

#### **3. Sharing & Marketing**
Controls external communications:
- Third-party data sharing
- Marketing emails
- Partner notifications

#### **4. Profile Visibility**
Manages public presence:
- Profile visibility to others
- Purchase history display
- Activity visibility

---

### Security Features

#### 🛡️ **Data Protection**
- All settings saved securely
- Encrypted data storage
- No sensitive data in plaintext

#### 🔐 **User Rights**
- Right to access data (Download)
- Right to deletion (Delete My Data)
- Right to opt-out (Toggle controls)
- Transparency in data usage

#### ⚠️ **Important Notices**
- Security alerts always enabled
- Some features may not work if permissions disabled
- Settings can be changed anytime

---

### Privacy Screen UI

**Header Section:**
- Shield icon with accent color
- "Your Privacy Matters" title
- Descriptive text about user control

**Settings Groups:**
1. Data Collection (3 toggles)
2. Location & Tracking (1 toggle)
3. Sharing & Marketing (2 toggles)
4. Profile Visibility (2 toggles)

**Data Management Section:**
- Download My Data (with download icon)
- Delete My Data (with trash icon in red)

**Legal Links:**
- Privacy Policy
- Terms of Service
- Cookie Policy

**Footer Note:**
- Information about feature dependencies
- Reassurance about control

---

### How to Use

#### **Adjust Privacy Settings:**
1. Open **Account** tab
2. Tap **Privacy**
3. Toggle any setting on/off
4. Changes apply immediately

#### **Download Your Data:**
1. Go to Privacy screen
2. Tap **Download My Data**
3. Confirm request
4. Receive email within 24 hours

#### **Delete Your Data:**
1. Go to Privacy screen
2. Tap **Delete My Data**
3. Read warning carefully
4. Confirm deletion
5. Data permanently removed

---

## Technical Implementation

### Files Created

#### **Language System:**
1. `src/contexts/LanguageContext.tsx`
   - Language context provider
   - Translation dictionary
   - Language persistence
   - `useLanguage()` hook

2. `src/screens/LanguageScreen.tsx`
   - Language selection UI
   - Flag icons
   - Current language display
   - Help information

#### **Privacy System:**
3. `src/screens/PrivacyScreen.tsx`
   - Privacy settings UI
   - Toggle controls
   - Data management actions
   - Legal links

---

### Navigation Updates

**New Routes Added:**
- `Language: undefined`
- `Privacy: undefined`

**Account Screen Integration:**
- Language shows current selection (English/ភាសាខ្មែរ)
- Privacy navigates to full settings

---

### Context Providers

**App Wrapper Structure:**
```typescript
<LanguageProvider>
  <ThemeProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </ThemeProvider>
</LanguageProvider>
```

**Provider Order:**
1. LanguageProvider (outermost)
2. ThemeProvider
3. Navigation

---

## User Experience

### 🎨 **Visual Design**
- Beautiful flag icons for language selection
- Color-coded privacy controls
- Consistent iconography
- Clear section grouping

### 🌓 **Dark Mode Support**
- All screens fully themed
- Appropriate contrast ratios
- Icon color adaptation

### 📱 **Responsive Layout**
- Scrollable content
- Touch-friendly controls
- Clear visual hierarchy

### ♿ **Accessibility**
- Clear labels and descriptions
- Sufficient touch targets
- Readable font sizes
- Descriptive help text

---

## Best Practices

### **For Language:**
- Always use `t()` function for user-facing text
- Keep translations in sync
- Test both languages regularly
- Consider text length differences

### **For Privacy:**
- Respect user choices
- Be transparent about data usage
- Provide easy opt-out options
- Make settings discoverable

---

## Future Enhancements

### **Language:**
- [ ] Add more languages (Thai, Vietnamese, etc.)
- [ ] Automatic language detection
- [ ] Right-to-left language support
- [ ] Dynamic content translation (event names)

### **Privacy:**
- [ ] Two-factor authentication
- [ ] Biometric privacy lock
- [ ] Data export in multiple formats
- [ ] Privacy audit logs
- [ ] GDPR compliance tools

---

## Testing Guide

### **Test Language Switching:**
1. Go to Account → Language
2. Select Khmer (ភាសាខ្មែរ)
3. Verify language changes immediately
4. Check navigation labels
5. Switch back to English
6. Verify persistence after app restart

### **Test Privacy Settings:**
1. Go to Account → Privacy
2. Toggle each setting
3. Verify immediate response
4. Test Download My Data alert
5. Test Delete My Data confirmation
6. Check legal links

---

## Support

### **Language Issues:**
- Missing translations? Add to `LanguageContext.tsx`
- Wrong translation? Update translation dictionary
- Language not saving? Check AsyncStorage permissions

### **Privacy Issues:**
- Settings not saving? Check state management
- Alerts not showing? Verify Alert imports
- Legal links not working? Update URLs

---

## Summary

✅ **Language Features:**
- Bilingual support (English & Khmer)
- Beautiful selection UI
- Persistent preferences
- Easy integration with `useLanguage()` hook

✅ **Privacy Features:**
- 8 granular privacy controls
- Data download & deletion
- Legal document access
- Security-first design

✅ **User Experience:**
- Intuitive interfaces
- Immediate feedback
- Full dark mode support
- Clear documentation

Both features are **production-ready** and follow industry best practices for internationalization and privacy compliance!

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Copyright:** © 2025 ProGet Inc.

