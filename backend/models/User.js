import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ['Host', 'Participant', 'Sponsor'],
  },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  country: { type: String },
  hackathonName: { type: String }, // For Hosts
  schoolName: { type: String }, // For Participants
  technicalSkills: { type: String }, // For Participants
  companyName: { type: String }, // For Sponsors
  hackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
  claimedIdea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    default: null,
  },
  recentMessages: [
    {
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
