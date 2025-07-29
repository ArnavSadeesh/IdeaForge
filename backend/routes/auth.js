import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, userType, email, firstName, lastName, country, hackathonName, schoolName, technicalSkills, companyName } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      userType,
      email,
      firstName,
      lastName,
      country,
      hackathonName,
      schoolName,
      technicalSkills,
      companyName,
    });

    await user.save();

    if (userType === 'Host') {
      const hackathonCode = Math.random().toString(36).substring(2, 8);
      const hackathon = new Hackathon({
        name: hackathonName,
        code: hackathonCode,
        hosts: [user._id],
      });
      await hackathon.save();

      user.hackathons.push(hackathon._id);
      await user.save();

      return res.status(201).json({ 
        msg: 'Host registered successfully', 
        hackathonCode,
        hackathonName: hackathon.name,
      });
    }

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/login', async (req, res) => {
  const { username, password, hackathonCode } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    let hackathon = null;
    if (hackathonCode) {
      hackathon = await Hackathon.findOne({ code: hackathonCode });
      if (hackathon && !user.hackathons.includes(hackathon._id)) {
        user.hackathons.push(hackathon._id);
        await user.save();
      }
    }

    const payload = {
      id: user.id,
      userType: user.userType, // Include userType in the payload
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          userType: user.userType, 
          hackathonName: hackathon ? hackathon.name : user.hackathonName, 
          hackathonId: hackathon ? hackathon._id : null 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;