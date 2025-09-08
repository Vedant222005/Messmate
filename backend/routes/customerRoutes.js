import express from 'express';
import { authenticate, authorizeRole } from '../middlewares/authMiddleware.js';
import {
  getAllMesses,
  getLinkedMess,
  getNotices,
  getMySubscriptionStatus
} from '../controllers/customerController.js';

const router = express.Router();

router.get('/messes', authenticate, authorizeRole(['customer']), getAllMesses);
router.get('/my-mess', authenticate, authorizeRole(['customer']), getLinkedMess); 
router.get('/notices', authenticate, authorizeRole(['customer']), getNotices);
router.get('/subscription-status', authenticate, authorizeRole(['customer']), getMySubscriptionStatus);

export default router;  