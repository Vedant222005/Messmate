import express from 'express';
import { authenticate, authorizeRole } from '../middlewares/authMiddleware.js';
import {
  createMess,
  getOwnerMess,
  addCustomerToMess,  // Make sure this is imported
  removeCustomerFromMess,
  getAllCustomers,
  addNotice,
  updateTodaysMenu,
  getCustomerDetails
} from '../controllers/messController.js';

const router = express.Router();

router.post('/', authenticate, authorizeRole(['owner']), createMess);
router.get('/my-mess', authenticate, authorizeRole(['owner']), getOwnerMess);
router.get('/available-customers', authenticate, authorizeRole(['owner']), getAllCustomers);
router.post('/add-customer', authenticate, authorizeRole(['owner']), addCustomerToMess);  // This line
router.post('/remove-customer', authenticate, authorizeRole(['owner']), removeCustomerFromMess);
router.post('/notice', authenticate, authorizeRole(['owner']), addNotice);
router.put('/menu', authenticate, authorizeRole(['owner']), updateTodaysMenu);
router.get('/customers', authenticate, authorizeRole(['owner']), getCustomerDetails);

export default router;
