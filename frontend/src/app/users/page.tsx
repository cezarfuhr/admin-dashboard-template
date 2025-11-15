'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserList } from '@/components/users/UserList';
import { UserForm } from '@/components/users/UserForm';
import { User } from '@/lib/api';
import { Plus, X } from 'lucide-react';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingUser(undefined);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg mx-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-10"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
              <UserForm user={editingUser} onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <UserList key={refreshKey} onEdit={handleEdit} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
