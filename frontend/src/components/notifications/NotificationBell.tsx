'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotificationStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, removeNotification, clearAll } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Notificações</h3>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Limpar tudo
                </Button>
              )}
            </div>

            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getVariant(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
