'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, BarChart3, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
