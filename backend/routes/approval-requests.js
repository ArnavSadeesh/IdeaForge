import express from 'express';
import ApprovalRequest from '../models/ApprovalRequest.js';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import Hackathon from '../models/Hackathon.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, themes, keywords, requireAuthor, implementationPlan, hackathonId, ideaId } = req.body;

    const claimerUser = await User.findById(req.user._id);
    if (claimerUser.claimedIdea) {
      return res.status(400).json({ msg: 'You have already claimed an idea.' });
    }

    const requireAuthorUser = await User.findById(requireAuthor);

    const approvalRequest = new ApprovalRequest({
      title,
      description,
      themes,
      keywords,
      requireAuthorUsername: requireAuthorUser.username,
      claimerUsername: claimerUser.username,
      requireAuthorEmail: requireAuthorUser.email,
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

router.get('/', requireAuth, async (req, res) => {
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

router.patch('/:id/approve', requireAuth, async (req, res) => {
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
    const claimerMsg = `Request to Claim ${approvalRequest.title} was approved! Contact idea requireAuthor ${approvalRequest.requireAuthorUsername} at ${approvalRequest.requireAuthorEmail}.`;
    claimerUser.recentMessages.push({ text: claimerMsg, timestamp: new Date() });

    await idea.save();
    await claimerUser.save();

    const requireAuthor = await User.findOne({ username: approvalRequest.requireAuthorUsername });
    if (!requireAuthor) {
      return res.status(404).json({ msg: 'Author user not found' });
    }

    const requireAuthorMsg = `Your idea ${approvalRequest.title} was claimed by ${approvalRequest.claimerUsername}. You can contact them at ${approvalRequest.claimerEmail}!`;
    requireAuthor.recentMessages.push({ text: requireAuthorMsg, timestamp: new Date() });
    await requireAuthor.save(); 

    await approvalRequest.deleteOne();

    res.json({ msg: 'Idea claimed and approved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
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
