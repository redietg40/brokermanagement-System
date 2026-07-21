const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

// Prisma client singleton for serverless
let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prismaAdmin) {
    global.prismaAdmin = new PrismaClient();
  }
  prisma = global.prismaAdmin;
}

// Get Dashboard Statistics
router.get('/stats', async (req, res) => {
  try {
    const pendingBrokers = await prisma.broker.count({ where: { status: 'pending' } });
    const approvedBrokers = await prisma.broker.count({ where: { status: 'approved' } });
    const totalListings = await prisma.listing.count();

    res.json({
      success: true,
      stats: {
        pendingBrokers,
        approvedBrokers,
        totalListings
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics.' });
  }
});

// Get Pending Verification Requests
router.get('/pending-brokers', async (req, res) => {
  try {
    const brokers = await prisma.broker.findMany({
      where: { status: 'pending' },
      orderBy: { registeredAt: 'desc' }
    });
    res.json({ success: true, brokers });
  } catch (error) {
    console.error('Error fetching pending brokers:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pending requests.' });
  }
});

// Get All Brokers Registry
router.get('/brokers', async (req, res) => {
  try {
    const brokers = await prisma.broker.findMany({
      orderBy: { registeredAt: 'desc' }
    });
    res.json({ success: true, brokers });
  } catch (error) {
    console.error('Error fetching all brokers:', error);
    res.status(500).json({ success: false, message: 'Server error fetching brokers.' });
  }
});

// Get Global Property Listing Registry (with optional filters)
router.get('/listings', async (req, res) => {
  try {
    const { category, status } = req.query;
    const where = {};
    if (category) where.category = category;
    if (status) where.listingStatus = status;

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        broker: {
          select: { name: true }
        }
      }
    });

    const formattedListings = listings.map(l => ({
      ...l,
      brokerName: l.broker.name
    }));

    res.json({ success: true, listings: formattedListings });
  } catch (error) {
    console.error('Error fetching all listings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listings.' });
  }
});

// Approve Broker License
router.post('/approve-broker/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.broker.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        rejectionReason: null
      }
    });

    res.json({ success: true, message: 'Broker approved and verified successfully.' });
  } catch (error) {
    console.error('Error approving broker:', error);
    res.status(500).json({ success: false, message: 'Server error verifying broker.' });
  }
});

// Reject Broker License
router.post('/reject-broker/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    await prisma.broker.update({
      where: { id },
      data: {
        status: 'rejected',
        rejectionReason: reason || 'Credentials did not satisfy platform terms.'
      }
    });

    res.json({ success: true, message: 'Broker verification request rejected.' });
  } catch (error) {
    console.error('Error rejecting broker:', error);
    res.status(500).json({ success: false, message: 'Server error rejecting broker.' });
  }
});

// Delete Broker (Cascades to listings via Prisma Cascade option)
router.delete('/delete-broker/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.broker.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Broker and associated listings deleted successfully.' });
  } catch (error) {
    console.error('Error deleting broker:', error);
    res.status(500).json({ success: false, message: 'Server error deleting broker.' });
  }
});

// Delete Listing
router.delete('/delete-listing/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.listing.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Property listing deleted successfully.' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ success: false, message: 'Server error deleting listing.' });
  }
});

// Approve Listing (make it public)
router.post('/approve-listing/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.listing.update({
      where: { id },
      data: { listingStatus: 'approved', active: true }
    });
    res.json({ success: true, message: 'Listing approved and now publicly visible.' });
  } catch (error) {
    console.error('Error approving listing:', error);
    res.status(500).json({ success: false, message: 'Server error approving listing.' });
  }
});

// Reject Listing
router.post('/reject-listing/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    await prisma.listing.update({
      where: { id },
      data: { listingStatus: 'rejected', active: false }
    });
    res.json({ success: true, message: 'Listing rejected.' });
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).json({ success: false, message: 'Server error rejecting listing.' });
  }
});

module.exports = router;
