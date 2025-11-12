const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Event = require('./models/Event');
const User = require('./models/User');

// Load environment variables
require('dotenv').config();

// Sample events data
const events = [
  {
    name: 'Summer Music Festival 2025',
    artist: 'Various Artists',
    date: 'July 15, 2025',
    time: '6:00 PM',
    venue: 'Central Park Arena',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    price: 89.99,
    category: 'festival',
    description: 'Join us for the biggest summer music festival featuring top artists from around the world!',
    badges: ['Popular', 'Outdoor'],
    totalSeats: 100,
    availableSeats: 100,
    seatLayout: { rows: 10, cols: 10 },
    takenSeats: [],
    isFeatured: true,
  },
  {
    name: 'Rock Legends Live',
    artist: 'The Rock Band',
    date: 'August 20, 2025',
    time: '8:00 PM',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    price: 120.00,
    category: 'concert',
    description: 'Experience the legendary rock band live in concert!',
    badges: ['Premium', 'VIP Available'],
    totalSeats: 100,
    availableSeats: 100,
    seatLayout: { rows: 10, cols: 10 },
    takenSeats: [],
    isFeatured: true,
  },
  {
    name: 'Jazz Night Under Stars',
    artist: 'Jazz Quartet',
    date: 'September 5, 2025',
    time: '7:30 PM',
    venue: 'Blue Note Jazz Club',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    price: 65.00,
    category: 'concert',
    description: 'An intimate evening of smooth jazz and soulful melodies.',
    badges: ['Intimate', 'Limited Seats'],
    totalSeats: 50,
    availableSeats: 50,
    seatLayout: { rows: 5, cols: 10 },
    takenSeats: [],
    isFeatured: false,
  },
  {
    name: 'Electronic Dance Night',
    artist: 'DJ Pulse',
    date: 'October 10, 2025',
    time: '9:00 PM',
    venue: 'Electric Factory',
    location: 'Philadelphia, PA',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    price: 45.00,
    category: 'concert',
    description: 'Dance the night away with the hottest DJ in electronic music!',
    badges: ['21+', 'Dance Floor'],
    totalSeats: 200,
    availableSeats: 200,
    seatLayout: { rows: 20, cols: 10 },
    takenSeats: [],
    isFeatured: false,
  },
  {
    name: 'Classical Symphony Orchestra',
    artist: 'City Orchestra',
    date: 'November 15, 2025',
    time: '7:00 PM',
    venue: 'Carnegie Hall',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800',
    price: 95.00,
    category: 'concert',
    description: 'A magical evening of classical masterpieces performed by world-class musicians.',
    badges: ['Elegant', 'Classic'],
    totalSeats: 150,
    availableSeats: 150,
    seatLayout: { rows: 15, cols: 10 },
    takenSeats: [],
    isFeatured: true,
  },
];

// Sample user
const sampleUser = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  password: 'password123',
  phone: '+1 (555) 123-4567',
  bio: 'Concert enthusiast and music lover 🎵',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log('📝 Creating sample user...');
    const user = await User.create(sampleUser);
    console.log(`✅ User created: ${user.email}`);

    console.log('🎉 Creating events...');
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ ${createdEvents.length} events created`);

    console.log('\n📊 Database seeded successfully!\n');
    console.log('Sample User Credentials:');
    console.log(`  Email: ${sampleUser.email}`);
    console.log(`  Password: ${sampleUser.password}`);
    console.log(`\n🎫 Events created: ${createdEvents.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

