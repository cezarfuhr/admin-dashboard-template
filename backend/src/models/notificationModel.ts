import { Notification, NotificationType, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class NotificationModel {
  static async findByUserId(
    userId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Notification>> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async create(notificationData: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
  }): Promise<Notification> {
    return await prisma.notification.create({
      data: notificationData,
    });
  }

  static async markAsRead(id: string): Promise<Notification | null> {
    try {
      return await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    } catch (error) {
      return null;
    }
  }

  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return result.count;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.notification.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async deleteAll(userId: string): Promise<number> {
    const result = await prisma.notification.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
