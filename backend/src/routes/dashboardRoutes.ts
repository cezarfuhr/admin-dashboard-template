import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/stats', DashboardController.getStats);
router.get('/charts/:type', DashboardController.getChartData);

export default router;
