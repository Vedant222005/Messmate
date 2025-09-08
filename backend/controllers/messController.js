import Mess from '../models/messModel.js';
import Customer from '../models/customerModel.js';
import User from '../models/userModel.js';

export const createMess = async (req, res) => {
  try {
    const { name, address, pricePerMonth } = req.body;
    
    const mess = new Mess({
      name,
      address,
      pricePerMonth,
      owner: req.user._id
    });

    await mess.save();
    
    res.status(201).json({
      message: 'Mess created successfully',
      mess
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerMess = async (req, res) => {
  try {
    const mess = await Mess.findOne({ owner: req.user._id })
      .populate('customers', 'user subscription age')
      .populate({
        path: 'customers',
        populate: {
          path: 'user',
          select: 'name email phone address'
        }
      });

    if (!mess) {
      return res.status(404).json({ message: 'No mess found' });
    }

    res.json(mess);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCustomerToMess = async (req, res) => {
  try {
    const { customerEmail, subscriptionType, startDate, endDate } = req.body;

    const mess = await Mess.findOne({ owner: req.user._id });
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    // Find customer by email
    const user = await User.findOne({ email: customerEmail, role: 'customer' });
    if (!user) {
      return res.status(404).json({ message: 'Customer not found with this email' });
    }

    const customer = await Customer.findOne({ user: user._id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    // Check if customer is already linked to any mess
    if (customer.subscription.messId) {
      return res.status(400).json({ message: 'Customer is already linked to a mess' });
    }

    // Calculate due amount
    const pricePerMonth = subscriptionType === 'one-time' 
      ? mess.pricePerMonth.oneTime 
      : mess.pricePerMonth.twoTime;

    // Update customer subscription
    customer.subscription = {
      messId: mess._id,
      type: subscriptionType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: true,
      dueAmount: pricePerMonth
    };

    await customer.save();

    // Add customer to mess
    mess.customers.push(customer._id);
    await mess.save();

    res.json({
      message: 'Customer added to mess successfully',
      customer: {
        id: customer._id,
        name: user.name,
        email: user.email,
        subscription: customer.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCustomerFromMess = async (req, res) => {
  try {
    const { customerId } = req.body;

    const mess = await Mess.findOne({ owner: req.user._id });
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if customer belongs to this mess
    if (customer.subscription.messId?.toString() !== mess._id.toString()) {
      return res.status(400).json({ message: 'Customer is not linked to your mess' });
    }

    // Remove subscription
    customer.subscription = {
      messId: null,
      type: null,
      startDate: null,
      endDate: null,
      isActive: false,
      dueAmount: 0
    };

    await customer.save();

    // Remove customer from mess
    mess.customers = mess.customers.filter(
      cust => cust.toString() !== customerId
    );
    await mess.save();

    res.json({
      message: 'Customer removed from mess successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    // Get all customers who are not linked to any mess
    const availableCustomers = await Customer.find({
      'subscription.messId': { $exists: false }
    }).populate('user', 'name email phone address');

    res.json({
      availableCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNotice = async (req, res) => {
  try {
    const { message } = req.body;
    
    const mess = await Mess.findOne({ owner: req.user._id });
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    mess.notices.push({ message });
    await mess.save();

    res.json({
      message: 'Notice added successfully',
      notice: mess.notices[mess.notices.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTodaysMenu = async (req, res) => {
  try {
    const { breakfast, lunch, dinner } = req.body;
    
    const mess = await Mess.findOne({ owner: req.user._id });
    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    mess.todaysMenu = { breakfast, lunch, dinner };
    await mess.save();

    res.json({
      message: 'Menu updated successfully',
      todaysMenu: mess.todaysMenu
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerDetails = async (req, res) => {
  try {
    const mess = await Mess.findOne({ owner: req.user._id })
      .populate({
        path: 'customers',
        populate: {
          path: 'user',
          select: 'name email phone address'
        }
      });

    if (!mess) {
      return res.status(404).json({ message: 'Mess not found' });
    }

    res.json({
      customers: mess.customers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
