import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

router.post('/login', validateRequest(schemas.login), AuthController.login);
router.post('/register', validateRequest(schemas.createUser), AuthController.register);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/logout-all', authenticateToken, AuthController.logoutAll);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;
