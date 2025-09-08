import Customer from '../models/customerModel.js';
import Mess from '../models/messModel.js';
import User from '../models/userModel.js';

export const getAllMesses = async (req, res) => {
  try {
    const messes = await Mess.find()
      .populate('owner', 'name phone email')
      .select('name address pricePerMonth owner todaysMenu customers');

  
    const messesWithStats = messes.map(mess => ({
      _id: mess._id,
      name: mess.name,
      address: mess.address,
      pricePerMonth: mess.pricePerMonth,
      owner: mess.owner,
      todaysMenu: mess.todaysMenu,
      customerCount: mess.customers.length
    }));

    res.json({
      messes: messesWithStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLinkedMess = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id })
      .populate('subscription.messId', 'name address pricePerMonth notices todaysMenu owner')
      .populate({
        path: 'subscription.messId',
        populate: {
          path: 'owner',
          select: 'name phone email'
        }
      });

    if (!customer || !customer.subscription.messId) {
      return res.status(404).json({ message: 'You are not linked to any mess yet. Contact mess owner to get added.' });
    }

    res.json({
      mess: customer.subscription.messId,
      subscription: customer.subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id })
      .populate('subscription.messId', 'notices');

    if (!customer || !customer.subscription.messId) {
      return res.status(404).json({ message: 'You are not linked to any mess' });
    }

    res.json({
      notices: customer.subscription.messId.notices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySubscriptionStatus = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id })
      .populate('subscription.messId', 'name address owner')
      .populate({
        path: 'subscription.messId',
        populate: {
          path: 'owner',
          select: 'name phone email'
        }
      });

    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    res.json({
      subscription: customer.subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
