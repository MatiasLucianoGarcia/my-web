import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { PostsController } from './posts.controller.js';
import type { AuthRequest } from '../../middleware/auth.js';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (req, res, next) => PostsController.listPublished(req, res, next));
router.get('/admin', authenticate, requireAdmin, (req, res, next) => PostsController.listAdmin(req, res, next));
router.get('/:slug', (req, res, next) => PostsController.getBySlug(req, res, next));
router.post('/', authenticate, requireAdmin, (req: AuthRequest, res: Response, next: NextFunction) => PostsController.create(req, res, next));
router.put('/:id', authenticate, requireAdmin, (req, res, next) => PostsController.update(req, res, next));
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => PostsController.remove(req, res, next));

export default router;
