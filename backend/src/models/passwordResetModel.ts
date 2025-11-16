import { PasswordReset } from '@prisma/client';
import prisma from '../lib/prisma';
import crypto from 'crypto';

export class PasswordResetModel {
  static async create(userId: string): Promise<{ token: string; expiresAt: Date }> {
    // Delete any existing tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId },
    });

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration to 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Create password reset record
    await prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  static async findByToken(token: string): Promise<PasswordReset | null> {
    return await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async markAsUsed(token: string): Promise<boolean> {
    try {
      await prisma.passwordReset.update({
        where: { token },
        data: { used: true },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async deleteExpired(): Promise<number> {
    const result = await prisma.passwordReset.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true },
        ],
      },
    });
    return result.count;
  }

  static async deleteByUserId(userId: string): Promise<number> {
    const result = await prisma.passwordReset.deleteMany({
      where: { userId },
    });
    return result.count;
  }
}
