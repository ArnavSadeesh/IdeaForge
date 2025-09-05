import express from 'express';
import Hackathon from '../models/Hackathon.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Route to get hackathon details by ID
router.get('/:hackathonId', requireAuth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.hackathonId);
    if (!hackathon) {
      return res.status(404).json({ msg: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to add themes to a hackathon (Host only)
router.patch('/:hackathonId/themes', requireAuth, async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { themes } = req.body;

    // Ensure user is a Host and is associated with this hackathon
    if (req.user.userType !== 'Host') {
      return res.status(403).json({ msg: 'Only hosts can manage themes.' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ msg: 'Hackathon not found.' });
    }

    if (!hackathon.hosts.includes(req.user._id)) {
      return res.status(403).json({ msg: 'You are not requireAuthorized to manage themes for this hackathon.' });
    }

    hackathon.themes = themes; // Overwrite existing themes
    await hackathon.save();

    res.json({ msg: 'Themes updated successfully', themes: hackathon.themes });
  } catch (error) {
    console.error('Error in PATCH /hackathons/:hackathonId/themes:', error);
    res.status(500).send('Server error');
  }
});

// Route to get all hackathons (public)
router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find({}, 'name description participants hosts');
    res.json(hackathons);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).send('Server error');
  }
});

// Route to join a hackathon
router.post('/join', requireAuth, async (req, res) => {
  try {
    const { hackathonId, hackathonCode } = req.body;
    const userId = req.user._id;

    if (!hackathonCode) {
      return res.status(400).json({ msg: 'Hackathon code is required' });
    }

    // Find hackathon by code (more flexible than requiring both ID and code)
    const hackathon = await Hackathon.findOne({ code: hackathonCode });
    if (!hackathon) {
      return res.status(400).json({ msg: 'Invalid hackathon code' });
    }

    // If hackathonId is provided, verify it matches the found hackathon
    if (hackathonId && hackathon._id.toString() !== hackathonId) {
      return res.status(400).json({ msg: 'Hackathon ID and code do not match' });
    }

    // Find user and update their hackathons
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is already in this hackathon
    if (user.hackathons.includes(hackathonId)) {
      return res.status(400).json({ msg: 'You are already part of this hackathon' });
    }

    // Add hackathon to user's list
    user.hackathons.push(hackathonId);
    await user.save();

    // Add user to hackathon's participants if not already there
    if (!hackathon.participants.includes(userId)) {
      hackathon.participants = hackathon.participants || [];
      hackathon.participants.push(userId);
      await hackathon.save();
    }

    res.json({ 
      msg: 'Successfully joined hackathon',
      hackathon: {
        id: hackathon._id,
        name: hackathon.name,
        code: hackathon.code
      }
    });
  } catch (error) {
    console.error('Error joining hackathon:', error);
    res.status(500).send('Server error');
  }
});

export default router;
