import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { ContactsController } from './contacts.controller.js';
import rateLimit from 'express-rate-limit';

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 5,
  message: { success: false, message: 'Too many contact requests. Please try again later.' },
});

const router = Router();

router.post('/', contactLimiter, (req, res, next) => ContactsController.create(req, res, next));
router.get('/', authenticate, requireAdmin, (req, res, next) => ContactsController.list(req, res, next));
router.put('/:id/read', authenticate, requireAdmin, (req, res, next) => ContactsController.markAsRead(req, res, next));

export default router;
