import { Router } from 'express';
import { ProjectPartitionController } from '../controllers/ProjectPartitionController';

const router = Router();

router.get('/', ProjectPartitionController.getAll);
router.get('/project/:projectId', ProjectPartitionController.getByProjectId);
router.get('/partition/:partitionId', ProjectPartitionController.getByPartitionId);
router.post('/', ProjectPartitionController.create);
router.put('/:projectId/:partitionId', ProjectPartitionController.update);
router.delete('/:projectId/:partitionId', ProjectPartitionController.delete);

export default router;

