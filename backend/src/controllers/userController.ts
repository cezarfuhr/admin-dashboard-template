import { Response } from 'express';
import { UserModel } from '../models/userModel';
import { AuditLogModel } from '../models/auditLogModel';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await UserModel.findAll({ page, limit, search });
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  }

  static async getUserById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
  }

  static async createUser(req: AuthRequest, res: Response) {
    try {
      const userData = req.body;

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }

      const user = await UserModel.create(userData);

      // Create audit log
      await AuditLogModel.create({
        userId: req.userId,
        action: 'CREATE',
        entity: 'USER',
        entityId: user.id,
        changes: { name: user.name, email: user.email, role: user.role },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  }

  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userData = req.body;

      const user = await UserModel.update(id, userData);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Create audit log
      await AuditLogModel.create({
        userId: req.userId,
        action: 'UPDATE',
        entity: 'USER',
        entityId: id,
        changes: userData,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const success = await UserModel.delete(id);

      if (!success) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Create audit log
      await AuditLogModel.create({
        userId: req.userId,
        action: 'DELETE',
        entity: 'USER',
        entityId: id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  }
}
