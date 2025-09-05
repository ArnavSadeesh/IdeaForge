import express from 'express';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/claimed-idea', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('claimedIdea');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.claimedIdea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;