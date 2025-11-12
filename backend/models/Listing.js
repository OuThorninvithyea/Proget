const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
    unique: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Listing must have a seller'],
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: [true, 'Listing must have a ticket'],
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Listing must be for an event'],
  },
  listingType: {
    type: String,
    enum: ['sale', 'trade', 'both'],
    required: true,
  },
  // For Sale
  price: {
    type: Number,
    min: 0,
  },
  // For Trade
  tradePreferences: {
    preferredEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    acceptAnySimilar: {
      type: Boolean,
      default: false,
    },
    willingToAddCash: {
      type: Boolean,
      default: false,
    },
    maxAdditionalCash: {
      type: Number,
      default: 0,
    },
  },
  description: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'traded', 'cancelled', 'expired'],
    default: 'active',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  offers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradeOffer',
  }],
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  soldAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Generate unique listing ID
listingSchema.pre('validate', function(next) {
  if (!this.listingId) {
    this.listingId = `LST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  // Set expiration to 30 days if not set
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Index for faster queries
listingSchema.index({ sellerId: 1, status: 1 });
listingSchema.index({ eventId: 1, status: 1 });
listingSchema.index({ listingType: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);

