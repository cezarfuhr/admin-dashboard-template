'use client';

import { useEffect, useState } from 'react';
import { User, usersApi } from '@/lib/api';
import { DataTable, Column } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNotificationStore } from '@/lib/store';

interface UserListProps {
  onEdit?: (user: User) => void;
}

export function UserList({ onEdit }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Falha ao carregar usuários',
        type: 'error',
        read: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await usersApi.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      addNotification({
        title: 'Sucesso',
        message: 'Usuário excluído com sucesso',
        type: 'success',
        read: false,
      });
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Falha ao excluir usuário',
        type: 'error',
        read: false,
      });
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Nome',
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
          )}
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'role',
      header: 'Função',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data de Criação',
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: 'actions',
      header: 'Ações',
      sortable: false,
      render: (user) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(user);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return <DataTable data={users} columns={columns} searchKeys={['name', 'email']} />;
}
