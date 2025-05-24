const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Search profiles by name or wallet address
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    // Search for profiles where name or wallet address matches the query
    const profiles = await Profile.find({
      $or: [
        { name: { $regex: q, $options: 'i' } }, // Case-insensitive name search
        { walletAddress: { $regex: q, $options: 'i' } } // Case-insensitive wallet address search
      ]
    }).limit(10); // Limit to 10 results

    res.json(profiles);
  } catch (err) {
    console.error('Error in GET /search:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get profile by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const profile = await Profile.findOne({ walletAddress: req.params.walletAddress });
    if (profile) {
      res.json(profile);
    } else {
      // Create a new profile if not found
      const newProfile = new Profile({
        walletAddress: req.params.walletAddress,
        name: 'New Collector',
        rank: 'Bronze Collector',
        profileImage: 'default-profile',
        bannerImage: 'default-banner',
        bio: '',
        social: {
          twitter: '',
          instagram: '',
          website: ''
        },
        achievements: [],
        collections: []
      });
      await newProfile.save();
      res.status(201).json(newProfile);
    }
  } catch (err) {
    console.error('Error in GET /:walletAddress:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update profile by wallet address
router.patch('/:walletAddress', async (req, res) => {
  try {
    const profile = await Profile.findOne({ walletAddress: req.params.walletAddress });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update fields from request body
    const allowedUpdates = [
      'name', 'rank', 'profileImage', 'bannerImage', 'bio',
      'social', 'achievements', 'collections'
    ];

    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'social') {
          // Handle social object updates
          Object.keys(req.body.social).forEach(socialKey => {
            if (['twitter', 'instagram', 'website'].includes(socialKey)) {
              profile.social[socialKey] = req.body.social[socialKey];
            }
          });
        } else {
          profile[key] = req.body[key];
        }
      }
    });

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error('Error in PATCH /:walletAddress:', err);
    res.status(400).json({ message: err.message });
  }
});

// Create profile (if needed)
router.post('/', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ walletAddress });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      walletAddress,
      ...req.body
    });

    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    console.error('Error in POST /:', err);
    res.status(400).json({ message: err.message });
  }
});

// Optional: Delete profile (use with caution)
/*
router.delete('/:walletAddress', async (req, res) => {
  try {
    const profile = await Profile.findOne({ walletAddress: req.params.walletAddress });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    await profile.remove();
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

module.exports = router; 