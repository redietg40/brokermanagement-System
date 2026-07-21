const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import Routes
const authRoutes = require('../backend/routes/auth');
const adminRoutes = require('../backend/routes/admin');
const listingRoutes = require('../backend/routes/listings');

// Use Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/listings', listingRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'FindBroker REST API is active and running.' });
});

// Test endpoint for debugging
app.get('/test', (req, res) => {
  res.json({ message: 'API test endpoint is working', timestamp: new Date().toISOString() });
});

// Automatic Database Seeding for Vercel
async function seedDatabase() {
  try {
    // Test database connection first
    await prisma.$connect();
    console.log('Database connected successfully');
    
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      console.log('No administrator found. Seeding default system administrator...');
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      await prisma.admin.create({
        data: {
          name: 'System Admin',
          email: 'admin@findbroker.com',
          passwordHash: adminPasswordHash,
        },
      });
      console.log('System administrator seeded successfully (admin@findbroker.com / admin123).');
    }

    const brokerCount = await prisma.broker.count();
    if (brokerCount === 0) {
      console.log('No brokers found. Seeding default brokers and listings...');
      
      const brokerPasswordHash = await bcrypt.hash('password123', 10);

      // Seed Brokers
      const ahmed = await prisma.broker.create({
        data: {
          name: 'Ahmed Hassan',
          email: 'ahmed@findbroker.com',
          phone: '+251911123456',
          passwordHash: brokerPasswordHash,
          licenseNumber: 'ET-RE-001',
          city: 'Addis Ababa',
          bio: 'Expert real estate broker with 8+ years experience in Addis Ababa luxury properties.',
          status: 'approved',
          rating: 4.8,
          totalSales: 45,
          registeredAt: new Date(Date.now() - 90 * 86400000),
          approvedAt: new Date(Date.now() - 89 * 86400000),
        }
      });

      const sara = await prisma.broker.create({
        data: {
          name: 'Sara Mekonnen',
          email: 'sara@findbroker.com',
          phone: '+251922345678',
          passwordHash: brokerPasswordHash,
          licenseNumber: 'ET-RE-002',
          city: 'Bahir Dar',
          bio: 'Specializing in residential properties across major Ethiopian cities.',
          status: 'approved',
          rating: 4.9,
          totalSales: 62,
          registeredAt: new Date(Date.now() - 120 * 86400000),
          approvedAt: new Date(Date.now() - 119 * 86400000),
        }
      });

      const meron = await prisma.broker.create({
        data: {
          name: 'Meron Bekele',
          email: 'meron@findbroker.com',
          phone: '+251933456789',
          passwordHash: brokerPasswordHash,
          licenseNumber: 'ET-RE-003',
          city: 'Hawassa',
          bio: 'Commercial and residential property expert serving Southern Ethiopia.',
          status: 'approved',
          rating: 4.7,
          totalSales: 38,
          registeredAt: new Date(Date.now() - 60 * 86400000),
          approvedAt: new Date(Date.now() - 59 * 86400000),
        }
      });

      console.log('Brokers seeded. Seeding listings...');

      // Seed Listings
      const seedListings = [
        {
          brokerId: ahmed.id,
          title: 'Luxury Villa in Bole',
          type: 'villa',
          location: 'addis-ababa',
          locationLabel: 'Bole, Addis Ababa',
          price: 45000000,
          bedrooms: 5,
          bathrooms: 4,
          area: 450,
          saleStatus: 'for-sale',
          description: 'Stunning luxury villa featuring a private swimming pool, spacious garden, and premium finishes throughout. Located in the prestigious Bole area with 24/7 security and modern amenities.',
          images: ['images/villa2.jpg', 'images/villainside1.jpg', 'images/swimmingimage.jpg'],
          active: true,
          views: 1247,
          createdAt: new Date(Date.now() - 30 * 86400000)
        },
        {
          brokerId: ahmed.id,
          title: 'Modern Apartment in Kazanchis',
          type: 'apartment',
          location: 'addis-ababa',
          locationLabel: 'Kazanchis, Addis Ababa',
          price: 8500000,
          bedrooms: 3,
          bathrooms: 2,
          area: 120,
          saleStatus: 'for-sale',
          description: 'Contemporary apartment with stunning city views and modern amenities in the heart of the city.',
          images: ['images/2bedroomapartama.jpg', 'images/apartama2.jpg'],
          active: true,
          views: 892,
          createdAt: new Date(Date.now() - 25 * 86400000)
        },
        {
          brokerId: sara.id,
          title: 'Family House Near Lake',
          type: 'house',
          location: 'bahir-dar',
          locationLabel: 'Bahir Dar',
          price: 12000000,
          bedrooms: 4,
          bathrooms: 3,
          area: 200,
          saleStatus: 'for-sale',
          description: 'Beautiful family home with breathtaking lake views and traditional Ethiopian architectural elements.',
          images: ['images/Family House Near Lake.jpg', 'images/nearly lake room.jpg', 'images/nearly lakebedroom.jpg'],
          active: true,
          views: 634,
          createdAt: new Date(Date.now() - 20 * 86400000)
        },
        {
          brokerId: sara.id,
          title: 'Prime Commercial Building',
          type: 'commercial',
          location: 'addis-ababa',
          locationLabel: 'Megenagna, Addis Ababa',
          price: 75000000,
          bedrooms: 0,
          bathrooms: 6,
          area: 800,
          saleStatus: 'for-sale',
          description: "Prime commercial property in the heart of Addis Ababa's business district with excellent accessibility.",
          images: ['images/Commercial Building1.jpg', 'images/Commercial Building2.jpg', 'images/Commercial Building courtyard.jpg'],
          active: true,
          views: 456,
          createdAt: new Date(Date.now() - 15 * 86400000)
        },
        {
          brokerId: meron.id,
          title: 'Lakeside Apartment Hawassa',
          type: 'apartment',
          location: 'hawassa',
          locationLabel: 'Hawassa',
          price: 6500000,
          bedrooms: 2,
          bathrooms: 2,
          area: 95,
          saleStatus: 'for-rent',
          description: 'Serene lakeside apartment offering peaceful living with beautiful water views and modern conveniences.',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
          active: true,
          views: 723,
          createdAt: new Date(Date.now() - 10 * 86400000)
        },
        {
          brokerId: meron.id,
          title: 'Traditional Villa Mekelle',
          type: 'villa',
          location: 'mekelle',
          locationLabel: 'Mekelle',
          price: 28000000,
          bedrooms: 6,
          bathrooms: 4,
          area: 350,
          saleStatus: 'for-sale',
          description: 'Elegant traditional villa combining authentic Ethiopian architecture with modern conveniences.',
          images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
          active: true,
          views: 567,
          createdAt: new Date(Date.now() - 5 * 86400000)
        }
      ];

      for (const listing of seedListings) {
        await prisma.listing.create({
          data: listing
        });
      }
      console.log('Database successfully seeded with default brokers and listings!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Seed database on first request (lazy loading for Vercel)
let seeded = false;
app.use(async (req, res, next) => {
  if (!seeded) {
    try {
      await seedDatabase();
      seeded = true;
    } catch (error) {
      console.error('Database seeding error:', error);
      // Continue even if seeding fails - the database might already have data
    }
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;