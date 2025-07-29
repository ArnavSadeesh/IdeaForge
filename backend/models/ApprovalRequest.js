import mongoose from 'mongoose'; 

const approvalRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  themes: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  authorUsername: {
    type: String,
    required: true,
  },
  claimerUsername: {
    type: String,
    required: true,
  },
  authorEmail: {
    type: String,
    required: true,
  },
  claimerEmail: {
    type: String,
    required: true,
  },
  implementationPlan: {
    type: String,
    required: true,
  },
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
});

const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);
export default ApprovalRequest; 
