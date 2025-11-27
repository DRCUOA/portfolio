import { Router } from 'express';
import { PortController } from '../controllers/PortController';

const router = Router();

router.get('/', PortController.getAll);
router.get('/type/:serverType', PortController.getByServerType);
router.get('/:id', PortController.getById);
router.post('/', PortController.create);
router.put('/:id', PortController.update);
router.delete('/:id', PortController.delete);

export default router;



