import express from 'express';
import Mess from '../models/Mess.model.js';
import User from '../models/User.model.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public list/search
router.get('/', async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };
    if (q) {
      filter.$text = { $search: q };
    }
    if (minPrice || maxPrice) {
      filter.pricePerMeal = {};
      if (minPrice) filter.pricePerMeal.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerMeal.$lte = Number(maxPrice);
    }
    const messes = await Mess.find(filter).populate('provider', 'name email');
    res.json(messes);
  } catch (error) {
    next(error);
  }
});

// Provider creates a mess
router.post('/', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const payload = { ...req.body, provider: req.user._id };
    const mess = await Mess.create(payload);
    res.status(201).json(mess);
  } catch (error) {
    next(error);
  }
});

// Get one mess
router.get('/:id', async (req, res, next) => {
  try {
    const mess = await Mess.findById(req.params.id).populate('provider', 'name email');
    if (!mess) return res.status(404).json({ message: 'Not found' });
    res.json(mess);
  } catch (error) {
    next(error);
  }
});

// Provider updates own mess
router.put('/:id', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const mess = await Mess.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      req.body,
      { new: true }
    );
    if (!mess) return res.status(404).json({ message: 'Not found' });
    res.json(mess);
  } catch (error) {
    next(error);
  }
});

// Provider deletes own mess
router.delete('/:id', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const result = await Mess.findOneAndDelete({ _id: req.params.id, provider: req.user._id });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
});

// Menu management routes

// Get menu for a mess
router.get('/:id/menu', async (req, res, next) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ message: 'Mess not found' });
    res.json(mess.menu || []);
  } catch (error) {
    next(error);
  }
});

// Provider adds menu item
router.post('/:id/menu', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const mess = await Mess.findOne({ _id: req.params.id, provider: req.user._id });
    if (!mess) return res.status(404).json({ message: 'Mess not found' });
    
    // Map incoming fields to schema with safe defaults
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const menuItem = {
      name: req.body.name || req.body.dish || 'Untitled',
      description: req.body.description || '',
      type: req.body.type || 'lunch',
      dayOfWeek: req.body.dayOfWeek || today,
      isVegetarian: Boolean(req.body.isVegetarian),
      imageUrl: req.body.imageUrl || req.body.image || ''
    };

    mess.menu.push(menuItem);
    await mess.save();
    
    res.status(201).json(mess.menu[mess.menu.length - 1]);
  } catch (error) {
    next(error);
  }
});

// Provider: list own messes for management
router.get('/mine', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const messes = await Mess.find({ provider: req.user._id });
    res.json(messes);
  } catch (error) {
    next(error);
  }
});



// Provider updates menu item
router.put('/:id/menu/:itemId', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const mess = await Mess.findOne({ _id: req.params.id, provider: req.user._id });
    if (!mess) return res.status(404).json({ message: 'Mess not found' });
    
    const menuItemIndex = mess.menu.findIndex(item => item._id.toString() === req.params.itemId);
    if (menuItemIndex === -1) return res.status(404).json({ message: 'Menu item not found' });
    
    mess.menu[menuItemIndex] = { ...mess.menu[menuItemIndex].toObject(), ...req.body };
    await mess.save();
    
    res.json(mess.menu[menuItemIndex]);
  } catch (error) {
    next(error);
  }
});

// Provider deletes menu item
router.delete('/:id/menu/:itemId', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const mess = await Mess.findOne({ _id: req.params.id, provider: req.user._id });
    if (!mess) return res.status(404).json({ message: 'Mess not found' });
    
    const menuItemIndex = mess.menu.findIndex(item => item._id.toString() === req.params.itemId);
    if (menuItemIndex === -1) return res.status(404).json({ message: 'Menu item not found' });
    
    mess.menu.splice(menuItemIndex, 1);
    await mess.save();
    
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    next(error);
  }
});

// Get detailed mess info including provider details
router.get('/:id/details', async (req, res, next) => {
  try {
    const mess = await Mess.findById(req.params.id);
    if (!mess) return res.status(404).json({ message: 'Mess not found' });
    
    const provider = await User.findById(mess.provider, 'name email phone address');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    
    res.json({
      ...mess.toJSON(),
      provider: provider.toJSON()
    });
  } catch (error) {
    next(error);
  }
});

export default router;

