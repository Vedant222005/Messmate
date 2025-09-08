import express from 'express';
import Order from '../models/Order.model.js';
import Mess from '../models/Mess.model.js';
import Notification from '../models/Notification.model.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Customer creates an order/subscription
router.post('/', requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const { messId, quantity = 1, notes, subscriptionType = 'daily', subscriptionPlanId } = req.body;
    const mess = await Mess.findById(messId);
    if (!mess || !mess.isActive) return res.status(404).json({ message: 'Mess not available' });

    // Find the selected subscription plan
    const subscriptionPlan = mess.subscriptionPlans.id(subscriptionPlanId);
    if (!subscriptionPlan) return res.status(400).json({ message: 'Invalid subscription plan' });

    const pricePerMeal = mess.pricePerMeal;
    const totalPrice = subscriptionPlan.price * Number(quantity);
    const totalDays = subscriptionPlan.durationDays * Number(quantity);
    
    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays);

    const order = await Order.create({
      customer: req.user._id,
      mess: mess._id,
      quantity,
      pricePerMeal,
      totalPrice,
      notes,
      subscriptionType,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      totalDays,
      daysRemaining: totalDays,
      amountDue: totalPrice
    });

    // Notify provider
    await Notification.create({
      user: mess.provider,
      title: 'New Subscription Request',
      message: `New ${subscriptionPlan.name} subscription request for ${quantity} meal(s) at ${mess.name}`,
      metadata: { orderId: order._id, type: 'subscription_request' }
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Provider gets pending subscription requests for their mess
router.get('/pending-subscriptions', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    // Find all messes owned by this provider
    const messes = await Mess.find({ provider: req.user._id }).select('_id');
    const messIds = messes.map(mess => mess._id);
    
    // Find all pending orders for these messes
    const pendingOrders = await Order.find({
      mess: { $in: messIds },
      status: 'pending'
    }).populate('customer', 'name email phone')
      .populate('mess', 'name address')
      .sort({ createdAt: -1 });
    
    res.json(pendingOrders);
  } catch (error) {
    next(error);
  }
});

// Provider approves or rejects subscription request
router.patch('/:id/approval', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(id).populate('mess');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Verify the provider owns this mess
    if (order.mess.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update order status
    order.status = status;
    if (status === 'approved') {
      order.status = 'active'; // Set to active immediately when approved
    }
    await order.save();
    
    // Notify customer
    await Notification.create({
      user: order.customer,
      title: `Subscription ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your subscription to ${order.mess.name} has been ${status === 'approved' ? 'approved' : 'rejected'}`,
      metadata: { orderId: order._id, type: 'subscription_response' }
    });
    
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Customer list own orders
router.get('/my', requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('mess', 'name pricePerMeal provider imageUrl address')
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

// Provider updates payment status
router.patch('/:id/payment-status', requireAuth, requireRole('provider'), async (req, res, next) => {
  try {
    const { paymentStatus, amountPaid } = req.body;
    const allowed = ['unpaid', 'partially_paid', 'paid'];
    if (!allowed.includes(paymentStatus)) return res.status(400).json({ message: 'Invalid payment status' });

    const order = await Order.findById(req.params.id).populate('mess');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.mess.provider) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    order.paymentStatus = paymentStatus;
    if (amountPaid !== undefined) {
      order.amountPaid = Number(amountPaid);
      order.amountDue = order.totalPrice - order.amountPaid;
    }
    
    // If fully paid, set amountDue to 0
    if (paymentStatus === 'paid') {
      order.amountPaid = order.totalPrice;
      order.amountDue = 0;
    }
    
    await order.save();

    // Notify customer
    await Notification.create({
      user: order.customer,
      title: 'Payment Status Update',
      message: `Your payment status for ${order.mess.name} has been updated to ${paymentStatus.replace('_', ' ')}`,
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

