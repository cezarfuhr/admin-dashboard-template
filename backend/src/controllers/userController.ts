import { Response } from 'express';
import { UserModel } from '../models/userModel';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

export class UserController {
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await UserModel.findAll();
      res.json({ success: true, data: users });
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
      const { password, ...userData } = req.body;

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ ...userData, password: hashedPassword });

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  }

  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const user = await UserModel.update(id, userData);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

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

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  }
}
