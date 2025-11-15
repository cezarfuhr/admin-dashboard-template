import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.verifyPassword(email, password);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        secret,
        { expiresIn: '24h' }
      );

      const { password: _, ...userResponse } = user;

      res.json({
        success: true,
        data: {
          user: userResponse,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { password, ...userData } = req.body;

      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
        role: 'user' // Default role for registration
      });

      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        secret,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }
}
