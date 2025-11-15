import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

// Admin only routes
router.post('/', requireAdmin, validateRequest(schemas.createUser), UserController.createUser);
router.put('/:id', requireAdmin, validateRequest(schemas.updateUser), UserController.updateUser);
router.delete('/:id', requireAdmin, UserController.deleteUser);

export default router;
