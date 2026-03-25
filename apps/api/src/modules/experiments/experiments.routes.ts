import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { ExperimentsController } from './experiments.controller.js';

const router = Router();

router.get('/', (req, res, next) => ExperimentsController.list(req, res, next));
router.get('/:slug', (req, res, next) => ExperimentsController.getBySlug(req, res, next));
router.post('/', authenticate, requireAdmin, (req, res, next) => ExperimentsController.create(req, res, next));
router.put('/:id', authenticate, requireAdmin, (req, res, next) => ExperimentsController.update(req, res, next));
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => ExperimentsController.remove(req, res, next));

export default router;
