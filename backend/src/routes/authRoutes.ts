import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();

router.post('/login', validateRequest(schemas.login), AuthController.login);
router.post('/register', validateRequest(schemas.createUser), AuthController.register);

export default router;
