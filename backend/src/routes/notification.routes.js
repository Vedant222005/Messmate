import express from 'express';
import Notification from '../models/Notification.model.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Not found' });
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// Provider broadcast: send a notification to all customers subscribed to their messes
router.post('/broadcast', requireAuth, async (req, res, next) => {
  try {
    const { title, message, userIds } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'title and message are required' });

    let targets = [];
    if (Array.isArray(userIds) && userIds.length) {
      targets = userIds;
    } else {
      // fallback: do nothing if list not provided (keeps it generic without coupling to orders)
      return res.status(400).json({ message: 'userIds required when not using subscription lookups' });
    }

    const docs = targets.map((uid) => ({ user: uid, title, message }));
    await Notification.insertMany(docs);
    res.status(201).json({ count: docs.length });
  } catch (error) {
    next(error);
  }
});

// Simple reminder endpoint: send a reminder notification to a user
router.post('/reminder', requireAuth, async (req, res, next) => {
  try {
    const { userId, title = 'Reminder', message } = req.body;
    if (!userId || !message) return res.status(400).json({ message: 'userId and message are required' });

    const note = await Notification.create({ user: userId, title, message });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

export default router;

