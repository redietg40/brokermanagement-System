const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Prisma client singleton for serverless
let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prismaAuth) {
    global.prismaAuth = new PrismaClient();
  }
  prisma = global.prismaAuth;
}

// ==================== BUYER (USER) AUTH ====================

// Register Buyer
router.post('/register-user', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        favorites: []
      }
    });

    res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('Error registering buyer:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login Buyer
router.post('/login-user', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No buyer account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error logging in buyer:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ==================== BROKER AUTH ====================

// Register Broker
router.post('/register-broker', async (req, res) => {
  const { name, email, phone, password, licenseNumber, city, bio, avatar } = req.body;
  try {
    // Check if email already registered as broker
    const existingBroker = await prisma.broker.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingBroker) {
      return res.status(400).json({ success: false, message: 'A broker account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const broker = await prisma.broker.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        licenseNumber: licenseNumber || '',
        city: city || '',
        bio: bio || '',
        avatar: avatar || null,
        status: 'pending' // starts in pending verification state
      }
    });

    res.status(201).json({
      success: true,
      broker: { id: broker.id, name: broker.name, email: broker.email, status: broker.status }
    });
  } catch (error) {
    console.error('Error registering broker:', error);
    res.status(500).json({ success: false, message: 'Server error during broker registration.' });
  }
});

// Get Broker by ID
router.get('/broker/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const broker = await prisma.broker.findUnique({
      where: { id }
    });
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker not found.' });
    }
    res.json({ success: true, broker });
  } catch (error) {
    console.error('Error fetching broker by ID:', error);
    res.status(500).json({ success: false, message: 'Server error fetching broker details.' });
  }
});

// Login Broker
router.post('/login-broker', async (req, res) => {
  const { email, password } = req.body;
  try {
    const broker = await prisma.broker.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: 'No broker account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, broker.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    // Verify Approval Status
    if (broker.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message: 'Your account is awaiting administrative approval. Please check back soon.'
      });
    }

    if (broker.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message: `Your registration was declined. Reason: ${broker.rejectionReason || 'Not specified.'}`
      });
    }

    res.json({
      success: true,
      broker: { id: broker.id, name: broker.name, email: broker.email, status: broker.status }
    });
  } catch (error) {
    console.error('Error logging in broker:', error);
    res.status(500).json({ success: false, message: 'Server error during broker login.' });
  }
});

// ==================== SYSTEM ADMIN AUTH ====================

// Login Admin
router.post('/login-admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Admin login attempt for email:', email);
    
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(404).json({ success: false, message: 'No administrator account found.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      console.log('Password mismatch for admin:', email);
      return res.status(400).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    console.log('Admin login successful for:', email);
    res.json({
      success: true,
      admin: { name: admin.name, email: admin.email, isAdmin: true }
    });
  } catch (error) {
    console.error('Error logging in administrator:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during admin login.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update Broker Profile
router.put('/update-broker/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, city, bio, totalSales } = req.body;
  try {
    const updatedBroker = await prisma.broker.update({
      where: { id },
      data: {
        name,
        phone,
        city,
        bio,
        totalSales: parseInt(totalSales) || 0
      }
    });
    res.json({ success: true, broker: updatedBroker });
  } catch (error) {
    console.error('Error updating broker profile:', error);
    res.status(500).json({ success: false, message: 'Server error updating broker details.' });
  }
});

// Get User by ID
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user details.' });
  }
});

// Toggle Favorite listing
router.post('/user/favorite', async (req, res) => {
  const { userId, listingId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let favorites = [...user.favorites];
    const index = favorites.indexOf(listingId);
    let isFavorite = false;

    if (index === -1) {
      favorites.push(listingId);
      isFavorite = true;
    } else {
      favorites.splice(index, 1);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { favorites }
    });

    res.json({ success: true, isFavorite });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ success: false, message: 'Server error toggling favorite.' });
  }
});

module.exports = router;
