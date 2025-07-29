import express from 'express';
import Hackathon from '../models/Hackathon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route to get hackathon details by ID
router.get('/:hackathonId', auth, async (req, res) => {
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
router.patch('/:hackathonId/themes', auth, async (req, res) => {
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

    if (!hackathon.hosts.includes(req.user.id)) {
      return res.status(403).json({ msg: 'You are not authorized to manage themes for this hackathon.' });
    }

    hackathon.themes = themes; // Overwrite existing themes
    await hackathon.save();

    res.json({ msg: 'Themes updated successfully', themes: hackathon.themes });
  } catch (error) {
    console.error('Error in PATCH /hackathons/:hackathonId/themes:', error);
    res.status(500).send('Server error');
  }
});

export default router;
