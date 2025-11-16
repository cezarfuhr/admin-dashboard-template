'use client';

import { useState, FormEvent } from 'react';
import { User, usersApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNotificationStore } from '@/lib/store';

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        await usersApi.update(user.id, formData);
        addNotification({
          title: 'Sucesso',
          message: 'Usuário atualizado com sucesso',
          type: 'success',
          read: false,
        });
      } else {
        await usersApi.create(formData);
        addNotification({
          title: 'Sucesso',
          message: 'Usuário criado com sucesso',
          type: 'success',
          read: false,
        });
      }
      onSuccess?.();
    } catch (error: any) {
      addNotification({
        title: 'Erro',
        message: error.response?.data?.error || 'Falha ao salvar usuário',
        type: 'error',
        read: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {!user && (
            <div>
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Função</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Avatar URL (opcional)</label>
            <Input
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
