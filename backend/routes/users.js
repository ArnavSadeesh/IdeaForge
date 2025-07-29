import express from 'express';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/claimed-idea', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('claimedIdea');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.claimedIdea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
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