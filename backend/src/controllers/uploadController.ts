import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/userModel';
import { AuditLogModel } from '../models/auditLogModel';
import fs from 'fs';
import path from 'path';

export class UploadController {
  static async uploadAvatar(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // Get current user to delete old avatar
      const currentUser = await UserModel.findById(req.userId);

      // Build avatar URL
      const avatarUrl = `/uploads/${req.file.filename}`;

      // Update user with new avatar
      const user = await UserModel.update(req.userId, {
        avatar: avatarUrl,
      });

      // Delete old avatar file if it exists and is a local file
      if (currentUser?.avatar && currentUser.avatar.startsWith('/uploads/')) {
        const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Create audit log
      await AuditLogModel.create({
        userId: req.userId,
        action: 'UPDATE',
        entity: 'USER',
        entityId: req.userId,
        changes: { avatar: avatarUrl },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        data: {
          avatar: avatarUrl,
          user,
        },
      });
    } catch (error) {
      console.error('Avatar upload error:', error);

      // Delete uploaded file on error
      if (req.file) {
        const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to upload avatar',
      });
    }
  }

  static async deleteAvatar(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const user = await UserModel.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Delete avatar file if it's a local file
      if (user.avatar && user.avatar.startsWith('/uploads/')) {
        const avatarPath = path.join(process.cwd(), user.avatar);
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }

      // Remove avatar from user
      await UserModel.update(req.userId, {
        avatar: null,
      });

      // Create audit log
      await AuditLogModel.create({
        userId: req.userId,
        action: 'DELETE',
        entity: 'AVATAR',
        entityId: req.userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        message: 'Avatar deleted successfully',
      });
    } catch (error) {
      console.error('Avatar delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete avatar',
      });
    }
  }
}
