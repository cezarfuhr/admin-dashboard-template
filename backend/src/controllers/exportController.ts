import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/userModel';
import { AuditLogModel } from '../models/auditLogModel';
import { ExportService } from '../services/exportService';

export class ExportController {
  /**
   * Export users to PDF
   */
  static async exportUsersToPDF(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll({});
      await ExportService.exportUsersToPDF(users.data, res);
    } catch (error) {
      console.error('Export users to PDF error:', error);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  }

  /**
   * Export users to Excel
   */
  static async exportUsersToExcel(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll({});
      await ExportService.exportUsersToExcel(users.data, res);
    } catch (error) {
      console.error('Export users to Excel error:', error);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  }

  /**
   * Export audit logs to PDF
   */
  static async exportAuditLogsToPDF(req: AuthRequest, res: Response) {
    try {
      const logs = await AuditLogModel.findAll({});
      await ExportService.exportAuditLogsToPDF(logs.data, res);
    } catch (error) {
      console.error('Export audit logs to PDF error:', error);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  }

  /**
   * Export audit logs to Excel
   */
  static async exportAuditLogsToExcel(req: AuthRequest, res: Response) {
    try {
      const logs = await AuditLogModel.findAll({});
      await ExportService.exportAuditLogsToExcel(logs.data, res);
    } catch (error) {
      console.error('Export audit logs to Excel error:', error);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  }
}
