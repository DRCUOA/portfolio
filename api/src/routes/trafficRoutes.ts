import { Router } from 'express';
import { TrafficController } from '../controllers/TrafficController';

const router = Router();

router.post('/click', TrafficController.logClick);
router.get('/logs', TrafficController.getAllLogs);
router.get('/logs/port/:portId', TrafficController.getLogsByPort);
router.get('/stats', TrafficController.getStats);
router.delete('/logs/:id', TrafficController.deleteLog);

export default router;










