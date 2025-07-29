import mongoose from 'mongoose'; 

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  intendedUse: {
    type: String,
    required: true,
  },
  intendedTheme: {
    type: String,
    required: true,
  },
  miscellaneous: {
    type: String,
  },
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource; 
