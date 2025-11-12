const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an event name'],
    trim: true,
  },
  artist: {
    type: String,
    required: [true, 'Please provide an artist name'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time'],
  },
  venue: {
    type: String,
    required: [true, 'Please provide a venue'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  category: {
    type: String,
    enum: ['concert', 'festival', 'sports', 'theater', 'comedy', 'other'],
    default: 'concert',
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  badges: [{
    type: String,
  }],
  // Seat Management
  totalSeats: {
    type: Number,
    default: 100,
  },
  availableSeats: {
    type: Number,
    default: 100,
  },
  seatLayout: {
    rows: { type: Number, default: 10 },
    cols: { type: Number, default: 10 },
  },
  takenSeats: [{
    type: String, // e.g., "A1", "B2", etc.
  }],
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
eventSchema.index({ name: 'text', artist: 'text' });
eventSchema.index({ status: 1, isActive: 1 });
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);

