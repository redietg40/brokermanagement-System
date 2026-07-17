const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

// Get Global Property Listing Registry
router.get('/listings', async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        broker: {
          select: { name: true }
        }
      }
    });

    // Format output matching local db format (brokerName is pre-populated)
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

module.exports = router;
