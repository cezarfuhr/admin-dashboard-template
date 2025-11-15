import { Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory database
let notifications: Notification[] = [];

export class NotificationModel {
  static async findByUserId(userId: string): Promise<Notification[]> {
    return notifications.filter(n => n.userId === userId);
  }

  static async create(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      ...notificationData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    notifications.push(notification);
    return notification;
  }

  static async markAsRead(id: string): Promise<Notification | null> {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return null;
    notification.read = true;
    return notification;
  }

  static async delete(id: string): Promise<boolean> {
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) return false;
    notifications.splice(index, 1);
    return true;
  }
}
