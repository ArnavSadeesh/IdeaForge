import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import approvalRequestRoutes from './routes/approval-requests.js';
import userRoutes from './routes/users.js';
import hackathonRoutes from './routes/hackathons.js';
import resourceRoutes from './routes/resources.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ 
  origin: 'https://ideaforge-client.onrender.com'
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => { 
  res.send('API is up and running!'); 
}); 

app.use('/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/approval-requests', approvalRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/resources', resourceRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
