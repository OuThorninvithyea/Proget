const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Ticket must belong to a user'],
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Ticket must belong to an event'],
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  seatIds: [{
    type: String,
    required: true,
  }],
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'used', 'cancelled', 'transferred', 'refunded'],
    default: 'active',
  },
  qrCode: {
    type: String,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  usedAt: {
    type: Date,
  },
  // Transfer Information
  transferredTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  transferredAt: {
    type: Date,
  },
  transferStatus: {
    type: String,
    enum: ['none', 'pending', 'completed', 'cancelled'],
    default: 'none',
  },
}, {
  timestamps: true,
});

// Generate unique ticket ID
ticketSchema.pre('validate', function(next) {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Generate QR code data
ticketSchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = JSON.stringify({
      ticketId: this.ticketId,
      eventId: this.eventId,
      userId: this.userId,
      seats: this.seatIds,
      timestamp: Date.now(),
    });
  }
  next();
});

// Index for faster queries
ticketSchema.index({ userId: 1, status: 1 });
ticketSchema.index({ eventId: 1 });
ticketSchema.index({ ticketId: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);

