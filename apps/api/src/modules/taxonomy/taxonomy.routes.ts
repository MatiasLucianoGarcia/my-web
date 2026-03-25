import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { TaxonomyController } from './taxonomy.controller.js';

const router = Router();

router.get('/tags', (req, res, next) => TaxonomyController.listTags(req, res, next));
router.post('/tags', authenticate, requireAdmin, (req, res, next) => TaxonomyController.createTag(req, res, next));
router.delete('/tags/:id', authenticate, requireAdmin, (req, res, next) => TaxonomyController.deleteTag(req, res, next));

router.get('/categories', (req, res, next) => TaxonomyController.listCategories(req, res, next));
router.post('/categories', authenticate, requireAdmin, (req, res, next) => TaxonomyController.createCategory(req, res, next));
router.delete('/categories/:id', authenticate, requireAdmin, (req, res, next) => TaxonomyController.deleteCategory(req, res, next));

export default router;
