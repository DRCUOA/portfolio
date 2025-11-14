import { Router } from 'express';
import { PartitionController } from '../controllers/PartitionController';

const router = Router();

router.get('/', PartitionController.getAll);
router.get('/:slug', PartitionController.getBySlug);
router.post('/', PartitionController.create);
router.put('/:id', PartitionController.update);
router.delete('/:id', PartitionController.delete);

export default router;




