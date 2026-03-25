import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { ExperiencesController } from './experiences.controller.js';

const router = Router();

router.get('/', (req, res, next) => ExperiencesController.list(req, res, next));
router.post('/', authenticate, requireAdmin, (req, res, next) => ExperiencesController.create(req, res, next));
router.put('/:id', authenticate, requireAdmin, (req, res, next) => ExperiencesController.update(req, res, next));
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => ExperiencesController.remove(req, res, next));

export default router;
