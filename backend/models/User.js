const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    },
    language: {
      type: String,
      enum: ["en", "km"],
      default: "en",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    // Privacy Settings
    privacySettings: {
      dataCollection: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      personalization: { type: Boolean, default: true },
      locationTracking: { type: Boolean, default: false },
      shareWithPartners: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
      profileVisibility: { type: Boolean, default: true },
      purchaseHistory: { type: Boolean, default: false },
    },
    // Notification Settings
    notificationSettings: {
      pushNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      eventReminders: { type: Boolean, default: true },
      ticketUpdates: { type: Boolean, default: true },
      marketplaceOffers: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      newsUpdates: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(8); // Reduced from 10 to 8 for faster hashing
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
