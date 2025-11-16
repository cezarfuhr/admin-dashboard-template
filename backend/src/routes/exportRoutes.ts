import { Router } from 'express';
import { ExportController } from '../controllers/exportController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

// All export routes require authentication and admin role
router.get(
  '/users/pdf',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ExportController.exportUsersToPDF
);

router.get(
  '/users/excel',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ExportController.exportUsersToExcel
);

router.get(
  '/audit-logs/pdf',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ExportController.exportAuditLogsToPDF
);

router.get(
  '/audit-logs/excel',
  authenticateToken,
  authorizeRole(['ADMIN']),
  ExportController.exportAuditLogsToExcel
);

export default router;
