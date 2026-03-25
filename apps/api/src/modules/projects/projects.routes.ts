import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { ProjectsController } from './projects.controller.js';

const router = Router();

router.get('/', (req, res, next) => ProjectsController.list(req, res, next));
router.get('/:slug', (req, res, next) => ProjectsController.getBySlug(req, res, next));
router.post('/', authenticate, requireAdmin, (req, res, next) => ProjectsController.create(req, res, next));
router.put('/:id', authenticate, requireAdmin, (req, res, next) => ProjectsController.update(req, res, next));
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => ProjectsController.remove(req, res, next));

export default router;
