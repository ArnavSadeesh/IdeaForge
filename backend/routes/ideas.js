import express from 'express';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { hackathonId, themes, keywords } = req.query;
  let query = { hackathon: hackathonId, claimed: false };

  if (themes) {
    const themesArray = themes.split(',').map(theme => theme.trim());
    query.theme = { $in: themesArray };
  }

  if (keywords) {
    const keywordsArray = keywords.split(',').map(keyword => keyword.trim());
    query.keywords = { $in: keywordsArray };
  }

  try {
    const ideas = await Idea.find(query);
    res.json(ideas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { title, description, theme, keywords, hackathonId } = req.body;
  const author = req.user._id;

  try {
    const newIdea = new Idea({
      title,
      description,
      theme,
      keywords,
      author,
      hackathon: hackathonId,
    });

    const savedIdea = await newIdea.save();

    // Add keywords to hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (hackathon && keywords && keywords.length > 0) {
      hackathon.keywords.push(...keywords);
      await hackathon.save();
    }

    res.json(savedIdea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // No longer setting claimer here, this will be done on approval
    // idea.claimer = req.user._id;
    // await idea.save();
    res.json(idea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/my-ideas', requireAuth, async (req, res) => {
  try {
    const myIdeas = await Idea.find({ author: req.user._id });
    res.json(myIdeas);
  } catch (err) {
    console.error('Error in /my-ideas route:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
