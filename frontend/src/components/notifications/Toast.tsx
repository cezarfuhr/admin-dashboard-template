'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNotificationStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  const recentNotifications = notifications.slice(0, 3);

  useEffect(() => {
    recentNotifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [recentNotifications, removeNotification]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {recentNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-card border rounded-lg shadow-lg p-4 w-80 animate-in slide-in-from-right"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
