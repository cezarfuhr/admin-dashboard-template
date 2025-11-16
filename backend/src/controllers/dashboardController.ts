import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { DashboardStats, ChartData } from '../types';

export class DashboardController {
  static async getStats(req: Request, res: Response) {
    try {
      const [totalUsers, activeUsers] = await Promise.all([
        UserModel.count(),
        UserModel.getActiveUsers(),
      ]);

      const stats: DashboardStats = {
        totalUsers,
        activeUsers,
        revenue: 45231.89,
        growth: 12.5,
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
  }

  static async getChartData(req: Request, res: Response) {
    try {
      const { type } = req.params;

      let data: ChartData[] = [];

      switch (type) {
        case 'revenue':
          data = [
            { name: 'Jan', value: 4000, date: '2024-01' },
            { name: 'Feb', value: 3000, date: '2024-02' },
            { name: 'Mar', value: 5000, date: '2024-03' },
            { name: 'Apr', value: 4500, date: '2024-04' },
            { name: 'May', value: 6000, date: '2024-05' },
            { name: 'Jun', value: 5500, date: '2024-06' },
          ];
          break;
        case 'users':
          data = [
            { name: 'Jan', value: 120 },
            { name: 'Feb', value: 150 },
            { name: 'Mar', value: 180 },
            { name: 'Apr', value: 220 },
            { name: 'May', value: 250 },
            { name: 'Jun', value: 280 },
          ];
          break;
        case 'activity':
          data = [
            { name: 'Mon', value: 65 },
            { name: 'Tue', value: 59 },
            { name: 'Wed', value: 80 },
            { name: 'Thu', value: 81 },
            { name: 'Fri', value: 56 },
            { name: 'Sat', value: 55 },
            { name: 'Sun', value: 40 },
          ];
          break;
        default:
          return res.status(400).json({ success: false, error: 'Invalid chart type' });
      }

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch chart data' });
    }
  }
}
