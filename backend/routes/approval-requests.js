import express from 'express';
import ApprovalRequest from '../models/ApprovalRequest.js';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import Hackathon from '../models/Hackathon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, themes, keywords, author, implementationPlan, hackathonId, ideaId } = req.body;

    const claimerUser = await User.findById(req.user.id);
    if (claimerUser.claimedIdea) {
      return res.status(400).json({ msg: 'You have already claimed an idea.' });
    }

    const authorUser = await User.findById(author);

    const approvalRequest = new ApprovalRequest({
      title,
      description,
      themes,
      keywords,
      authorUsername: authorUser.username,
      claimerUsername: claimerUser.username,
      authorEmail: authorUser.email,
      claimerEmail: claimerUser.email,
      implementationPlan,
      hackathonId,
      ideaId,
    });

    await approvalRequest.save();
    res.status(201).json(approvalRequest);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { hackathonId } = req.query;
    if (!hackathonId) {
      return res.status(400).json({ msg: 'Hackathon ID is required' });
    }
    const approvalRequests = await ApprovalRequest.find({ hackathonId });
    res.json(approvalRequests);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.patch('/:id/approve', auth, async (req, res) => {
  try {
    const approvalRequest = await ApprovalRequest.findById(req.params.id);
    if (!approvalRequest) {
      return res.status(404).json({ msg: 'Approval request not found' });
    }

    const idea = await Idea.findById(approvalRequest.ideaId);
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    const claimerUser = await User.findOne({ username: approvalRequest.claimerUsername });
    if (!claimerUser) {
      return res.status(404).json({ msg: 'Claimer user not found' });
    }

    // Removed: if (claimerUser.claimedIdea) check is now in POST /approval-requests

    idea.claimed = true;
    idea.claimer = claimerUser._id;
    claimerUser.claimedIdea = idea._id;
    const claimerMsg = `Request to Claim ${approvalRequest.title} was approved! Contact idea author ${approvalRequest.authorUsername} at ${approvalRequest.authorEmail}.`;
    claimerUser.recentMessages.push({ text: claimerMsg, timestamp: new Date() });

    await idea.save();
    await claimerUser.save();

    const author = await User.findOne({ username: approvalRequest.authorUsername });
    if (!author) {
      return res.status(404).json({ msg: 'Author user not found' });
    }

    const authorMsg = `Your idea ${approvalRequest.title} was claimed by ${approvalRequest.claimerUsername}. You can contact them at ${approvalRequest.claimerEmail}!`;
    author.recentMessages.push({ text: authorMsg, timestamp: new Date() });
    await author.save(); 

    await approvalRequest.deleteOne();

    res.json({ msg: 'Idea claimed and approved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const approvalRequest = await ApprovalRequest.findById(req.params.id);
    if (!approvalRequest) {
      return res.status(404).json({ msg: 'Approval request not found' });
    }

    const claimerUser = await User.findOne({ username: approvalRequest.claimerUsername });
    if (claimerUser) {
      const message = `Request to Claim ${approvalRequest.title} was rejected.`;
      claimerUser.recentMessages.push({ text: message, timestamp: new Date() });
      await claimerUser.save();
    }

    await approvalRequest.deleteOne();

    res.json({ msg: 'Approval request rejected and deleted.' });
  } catch (error) {
    console.error('Error in DELETE /approval-requests/:id:', error);
    res.status(500).send('Server error');
  }
});

export default router;
