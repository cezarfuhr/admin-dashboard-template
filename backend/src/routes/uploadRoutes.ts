import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import { upload, handleMulterError } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Upload avatar
router.post(
  '/avatar',
  upload.single('avatar'),
  handleMulterError,
  UploadController.uploadAvatar
);

// Delete avatar
router.delete('/avatar', UploadController.deleteAvatar);

export default router;
