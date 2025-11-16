import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { RefreshTokenModel } from '../models/refreshTokenModel';
import { PasswordResetModel } from '../models/passwordResetModel';
import { AuditLogModel } from '../models/auditLogModel';
import { EmailService } from '../services/emailService';
import { AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Refresh token lasts 7 days

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.verifyPassword(email, password);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Generate access token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      // Generate refresh token
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

      await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

      // Create audit log
      await AuditLogModel.create({
        userId: user.id,
        action: 'LOGIN',
        entity: 'AUTH',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      const { password: _, ...userResponse } = user;

      res.json({
        success: true,
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
          expiresIn: '15m',
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const userData = req.body;

      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }

      const user = await UserModel.create({
        ...userData,
        role: 'USER', // Default role for registration
      });

      // Generate access token
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      // Generate refresh token
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

      await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

      // Create audit log
      await AuditLogModel.create({
        userId: user.id,
        action: 'REGISTER',
        entity: 'AUTH',
        changes: { email: user.email, name: user.name },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
          refreshToken,
          expiresIn: '15m',
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ success: false, error: 'Refresh token required' });
      }

      const tokenRecord = await RefreshTokenModel.findByToken(refreshToken);

      if (!tokenRecord) {
        return res.status(401).json({ success: false, error: 'Invalid refresh token' });
      }

      if (new Date() > tokenRecord.expiresAt) {
        await RefreshTokenModel.delete(refreshToken);
        return res.status(401).json({ success: false, error: 'Refresh token expired' });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: tokenRecord.userId, role: (tokenRecord.user as any).role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      res.json({
        success: true,
        data: {
          accessToken,
          expiresIn: '15m',
        },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ success: false, error: 'Token refresh failed' });
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await RefreshTokenModel.delete(refreshToken);
      }

      // Create audit log
      if (req.userId) {
        await AuditLogModel.create({
          userId: req.userId,
          action: 'LOGOUT',
          entity: 'AUTH',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
      }

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, error: 'Logout failed' });
    }
  }

  static async logoutAll(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const count = await RefreshTokenModel.deleteByUserId(req.userId);

      // Create audit log
      await AuditLogModel.create({
        userId: req.userId,
        action: 'LOGOUT_ALL',
        entity: 'AUTH',
        changes: { tokensRevoked: count },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        message: `Logged out from ${count} device(s)`,
      });
    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({ success: false, error: 'Logout all failed' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await UserModel.findByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link will be sent',
        });
      }

      // Create password reset token
      const { token } = await PasswordResetModel.create(user.id);

      // Send email
      await EmailService.sendPasswordResetEmail(email, token);

      // Create audit log
      await AuditLogModel.create({
        userId: user.id,
        action: 'PASSWORD_RESET_REQUEST',
        entity: 'AUTH',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        message: 'If the email exists, a password reset link will be sent',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ success: false, error: 'Password reset request failed' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required',
        });
      }

      // Find reset token
      const resetRecord = await PasswordResetModel.findByToken(token);

      if (!resetRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token',
        });
      }

      // Check if token is expired
      if (new Date() > resetRecord.expiresAt) {
        return res.status(400).json({
          success: false,
          error: 'Reset token has expired',
        });
      }

      // Check if token was already used
      if (resetRecord.used) {
        return res.status(400).json({
          success: false,
          error: 'Reset token has already been used',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await UserModel.update(resetRecord.userId, {
        password: hashedPassword,
      });

      // Mark token as used
      await PasswordResetModel.markAsUsed(token);

      // Invalidate all refresh tokens for security
      await RefreshTokenModel.deleteByUserId(resetRecord.userId);

      // Create audit log
      await AuditLogModel.create({
        userId: resetRecord.userId,
        action: 'PASSWORD_RESET_COMPLETE',
        entity: 'AUTH',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        message: 'Password reset successfully. Please login with your new password',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, error: 'Password reset failed' });
    }
  }
}
