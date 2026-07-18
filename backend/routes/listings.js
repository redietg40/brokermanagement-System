const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get Public Approved Listings (Only active listings by verified/approved brokers)
router.get('/', async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        active: true,
        listingStatus: 'approved',
        broker: {
          status: 'approved'
        }
      },
      include: {
        broker: {
          select: { name: true, rating: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Adapt to local structure
    const formattedListings = listings.map(l => ({
      ...l,
      brokerName: l.broker.name,
      image: (l.images && l.images.length > 0) ? l.images[0] : 'images/villa2.jpg',
      broker: {
        name: l.broker.name,
        avatar: l.broker.avatar || 'images/broker-image-removebg-preview.png',
        rating: l.broker.rating || 4.8,
        experience: 'Verified Broker',
        verified: true
      }
    }));

    res.json({ success: true, listings: formattedListings });
  } catch (error) {
    console.error('Error fetching approved listings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listings.' });
  }
});

// Get Listings by specific Broker (MUST be before /:id route to avoid conflict)
router.get('/broker/:brokerId', async (req, res) => {
  const { brokerId } = req.params;
  try {
    const listings = await prisma.listing.findMany({
      where: { brokerId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching broker listings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching broker listings.' });
  }
});

// Get Listing by ID (including broker info)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        broker: {
          select: { name: true, rating: true, avatar: true, bio: true, phone: true, email: true }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Property listing not found.' });
    }

    const formattedListing = {
      ...listing,
      brokerName: listing.broker.name,
      // Provide custom adapter for detailed broker card in details modal if needed
      broker: {
        name: listing.broker.name,
        rating: listing.broker.rating,
        avatar: listing.broker.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        experience: 'Verified Agent',
        verified: true,
        phone: listing.broker.phone,
        email: listing.broker.email
      }
    };

    res.json({ success: true, listing: formattedListing });
  } catch (error) {
    console.error('Error fetching listing detail:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listing details.' });
  }
});

// Add New Listing (by broker)
router.post('/add', async (req, res) => {
  const { brokerId, title, category, type, location, locationLabel, price, bedrooms, bathrooms, area, description, saleStatus, images } = req.body;
  try {
    // Verify broker exists
    const broker = await prisma.broker.findUnique({ where: { id: brokerId } });
    if (!broker) {
      return res.status(404).json({ success: false, message: 'Broker account not found.' });
    }

    const listing = await prisma.listing.create({
      data: {
        brokerId,
        title,
        category: category || 'real-estate',
        type,
        location,
        locationLabel,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        area: parseFloat(area) || 0,
        description,
        saleStatus: saleStatus || 'for-sale',
        images: images || [],
        active: true,
        listingStatus: 'pending'  // Requires admin approval before going public
      }
    });

    res.status(201).json({ success: true, listing, message: 'Listing submitted. Pending admin approval before going live.' });
  } catch (error) {
    console.error('Error creating property listing:', error);
    res.status(500).json({ success: false, message: 'Server error saving property details.' });
  }
});

// Update Property Listing
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
  // Format numeric values if passed
  if (data.price) data.price = parseFloat(data.price);
  if (data.bedrooms) data.bedrooms = parseInt(data.bedrooms);
  if (data.bathrooms) data.bathrooms = parseInt(data.bathrooms);
  if (data.area) data.area = parseFloat(data.area);

  try {
    const listing = await prisma.listing.update({
      where: { id },
      data
    });

    res.json({ success: true, listing });
  } catch (error) {
    console.error('Error updating property listing:', error);
    res.status(500).json({ success: false, message: 'Server error updating property details.' });
  }
});

// Delete Property Listing
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.listing.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (error) {
    console.error('Error deleting property listing:', error);
    res.status(500).json({ success: false, message: 'Server error deleting listing.' });
  }
});

// Increment views on Listing
router.post('/view/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.listing.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
