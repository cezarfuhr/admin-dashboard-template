'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore, useThemeStore, useNotificationStore } from '@/lib/store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { addNotification } = useNotificationStore();

  const handleTestNotification = () => {
    addNotification({
      title: 'Notificação de Teste',
      message: 'Esta é uma notificação de teste do sistema',
      type: 'info',
      read: false,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input defaultValue={user?.name} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Função</label>
              <Input defaultValue={user?.role} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  Tema atual: {theme === 'light' ? 'Claro' : 'Escuro'}
                </p>
              </div>
              <Button onClick={toggleTheme}>
                Alternar para {theme === 'light' ? 'Escuro' : 'Claro'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configurar preferências de notificação</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestNotification}>
              Testar Notificação
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
