import express from 'express';
import Order from '../models/Order.model.js';
import Mess from '../models/Mess.model.js';
import Notification from '../models/Notification.model.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Customer creates an order/subscription
router.post('/', requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const { messId, quantity = 1, notes, subscriptionType = 'daily', subscriptionEndDate } = req.body;
    const mess = await Mess.findById(messId);
    if (!mess || !mess.isActive) return res.status(404).json({ message: 'Mess not available' });

    const pricePerMeal = mess.pricePerMeal;
    const totalPrice = pricePerMeal * Number(quantity);
    const order = await Order.create({
      customer: req.user._id,
      mess: mess._id,
      quantity,
      pricePerMeal,
      totalPrice,
      notes,
      subscriptionType,
      subscriptionEndDate
    });

    // Notify provider
    await Notification.create({
      user: mess.provider,
      title: 'New Subscription',
      message: `New ${subscriptionType} subscription for ${quantity} meal(s) at ${mess.name}`,
      metadata: { orderId: order._id }
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Customer list own orders
router.get('/my', requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('mess', 'name pricePerMeal provider')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Provider list orders for their messes
router.get('/provider', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'mess', match: { provider: req.user._id } })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders.filter((o) => o.mess));
  } catch (error) {
    next(error);
  }
});

// Provider updates order status
router.patch('/:id/status', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(req.params.id).populate('mess');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.mess.provider) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    order.status = status;
    await order.save();

    // Notify customer
    await Notification.create({
      user: order.customer,
      title: 'Order Update',
      message: `Your order for ${order.quantity} meal(s) is now ${status}`,
      metadata: { orderId: order._id }
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Customer adds absence dates
router.post('/:id/absence', requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const { date, reason } = req.body;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    
    const absenceDate = { date: new Date(date), reason };
    order.absenceDates.push(absenceDate);
    await order.save();
    
    // Notify provider
    const mess = await Mess.findById(order.mess);
    await Notification.create({
      user: mess.provider,
      title: 'Absence Request',
      message: `Customer has requested absence for ${new Date(date).toLocaleDateString()}`,
      metadata: { orderId: order._id }
    });
    
    res.status(201).json(order.absenceDates[order.absenceDates.length - 1]);
  } catch (error) {
    next(error);
  }
});

// Provider approves/rejects absence
router.patch('/:id/absence/:absenceId', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id).populate('mess');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (String(order.mess.provider) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    const absenceIndex = order.absenceDates.findIndex(a => a._id.toString() === req.params.absenceId);
    if (absenceIndex === -1) return res.status(404).json({ message: 'Absence date not found' });
    
    order.absenceDates[absenceIndex].status = status;
    await order.save();
    
    // Notify customer
    await Notification.create({
      user: order.customer,
      title: 'Absence Request Update',
      message: `Your absence request for ${new Date(order.absenceDates[absenceIndex].date).toLocaleDateString()} has been ${status}`,
      metadata: { orderId: order._id }
    });
    
    res.json(order.absenceDates[absenceIndex]);
  } catch (error) {
    next(error);
  }
});

// Get all absences for a provider's mess
router.get('/absences/provider', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'mess', match: { provider: req.user._id } })
      .populate('customer', 'name email')
      .select('absenceDates customer mess');
    
    const validOrders = orders.filter(o => o.mess);
    
    const absences = validOrders.flatMap(order => {
      return order.absenceDates.map(absence => ({
        id: absence._id,
        date: absence.date,
        reason: absence.reason,
        status: absence.status,
        customer: order.customer,
        mess: order.mess,
        orderId: order._id
      }));
    });
    
    res.json(absences);
  } catch (error) {
    next(error);
  }
});

export default router;

