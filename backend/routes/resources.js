import express from 'express';
import Resource from '../models/Resource.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Route to create a new resource (Sponsor only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, type, intendedUse, intendedTheme, miscellaneous } = req.body;

    // Ensure user is a Sponsor
    if (req.user.userType !== 'Sponsor') {
      return res.status(403).json({ msg: 'Only sponsors can add resources.' });
    }

    const newResource = new Resource({
      name,
      type,
      intendedUse,
      intendedTheme,
      miscellaneous,
      sponsor: req.user._id, // Assign the requireAuthenticated user's ID as the sponsor
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to get resources for a specific sponsor (Sponsor only)
router.get('/my-resources', requireAuth, async (req, res) => {
  try {
    // Ensure user is a Sponsor
    if (req.user.userType !== 'Sponsor') {
      return res.status(403).json({ msg: 'Only sponsors can view their resources.' });
    }

    const resources = await Resource.find({ sponsor: req.user._id });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
