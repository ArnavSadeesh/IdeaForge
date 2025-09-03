import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import Hackathon from '../models/Hackathon.js';
import { sendHackathonCodeEmail } from '../utils/emailService.js';

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

      // Send hackathon code email to host
      try {
        await sendHackathonCodeEmail(user.email, user.firstName, hackathonName, hackathonCode);
        console.log(`Hackathon code email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send hackathon code email:', emailError);
        // Don't fail registration if email fails - just log the error
      }

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
  console.log('Login attempt:', { username, hackathonCode }); // Added logging

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found'); // Added logging
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch'); // Added logging
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
        console.log('Login successful'); // Added logging
        res.json({ 
          token, 
          userType: user.userType, 
          hackathonName: hackathon ? hackathon.name : user.hackathonName, 
          hackathonId: hackathon ? hackathon._id : null 
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message); // Added logging
    res.status(500).send('Server error');
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      const frontendURL = process.env.NODE_ENV === 'production' 
        ? 'https://the-idea-forge.com' 
        : 'http://localhost:8001';

      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(`${frontendURL}/login?error=oauth_failed`);
      }

      // Check if registration is required
      if (!user && info && info.message === 'registration_required') {
        // Store Google profile in session or encode in URL for registration
        const encodedProfile = encodeURIComponent(JSON.stringify(info.googleProfile));
        return res.redirect(`${frontendURL}/register?google_profile=${encodedProfile}`);
      }

      if (!user) {
        return res.redirect(`${frontendURL}/login?error=oauth_failed`);
      }

      try {
        // Generate JWT token for the authenticated user
        const payload = {
          id: user.id,
          userType: user.userType,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Redirect to frontend with token and user info
        res.redirect(`${frontendURL}/auth/callback?token=${token}&userType=${user.userType}&userName=${user.username}`);
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`${frontendURL}/login?error=oauth_failed`);
      }
    })(req, res, next);
  }
);

// Complete Google registration
router.post('/complete-google-registration', async (req, res) => {
  try {
    const { googleProfile, username, userType, country, schoolName, technicalSkills, companyName, hackathonName } = req.body;

    if (!googleProfile || !username || !userType) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ googleId: googleProfile.googleId }, { email: googleProfile.email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create user with Google data and additional registration data
    const userData = {
      googleId: googleProfile.googleId,
      username,
      email: googleProfile.email,
      firstName: googleProfile.firstName,
      lastName: googleProfile.lastName,
      userType,
      country
    };

    // Add type-specific fields
    if (userType === 'Participant') {
      userData.schoolName = schoolName;
      userData.technicalSkills = technicalSkills;
    } else if (userType === 'Sponsor') {
      userData.companyName = companyName;
    } else if (userType === 'Host') {
      userData.hackathonName = hackathonName;
    }

    const user = new User(userData);
    await user.save();

    let hackathonCode = null;
    let createdHackathonName = null;

    // Create hackathon for Host users
    if (userType === 'Host') {
      hackathonCode = Math.random().toString(36).substring(2, 8);
      const hackathon = new Hackathon({
        name: hackathonName,
        code: hackathonCode,
        hosts: [user._id],
      });
      await hackathon.save();

      user.hackathons.push(hackathon._id);
      await user.save();
      createdHackathonName = hackathon.name;

      // Send hackathon code email to host
      try {
        await sendHackathonCodeEmail(user.email, user.firstName, hackathonName, hackathonCode);
        console.log(`Hackathon code email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send hackathon code email:', emailError);
        // Don't fail registration if email fails - just log the error
      }
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      userType: user.userType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      msg: 'Google registration completed successfully',
      token,
      userType: user.userType,
      userName: user.username,
      hackathonCode,
      hackathonName: createdHackathonName
    });

  } catch (error) {
    console.error('Complete Google registration error:', error);
    res.status(500).send('Server error');
  }
});

export default router;