import express from 'express';
import User from '../models/User.model.js';
import { signJwt } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Simple password validation function
const validatePassword = (password) => {
  // Only check if password exists
  if (!password || password.trim() === '') {
    return 'Password cannot be empty';
  }
  
  return null; // Password is valid
};

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role, phone, address });
    const token = signJwt({ userId: user._id, role: user.role });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signJwt({ userId: user._id, role: user.role });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  return res.json(req.user);
});

// Update current user
router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address
    });
  } catch (error) {
    next(error);
  }
});

// A no-op logout for JWT-based auth (client discards token)
router.post('/logout', requireAuth, async (req, res) => {
  return res.json({ message: 'Logged out' });
});

export default router;

