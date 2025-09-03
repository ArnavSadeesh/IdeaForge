import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  hosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  themes: [{ type: String }],
  keywords: [{ type: String }],
  description: { type: String }
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon;
