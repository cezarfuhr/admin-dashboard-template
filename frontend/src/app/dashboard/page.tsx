'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { dashboardApi, DashboardStats, ChartData } from '@/lib/api';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useNotificationStore } from '@/lib/store';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [usersData, setUsersData] = useState<ChartData[]>([]);
  const [activityData, setActivityData] = useState<ChartData[]>([]);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, revenueRes, usersRes, activityRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getChartData('revenue'),
        dashboardApi.getChartData('users'),
        dashboardApi.getChartData('activity'),
      ]);

      setStats(statsRes.data.data!);
      setRevenueData(revenueRes.data.data!);
      setUsersData(usersRes.data.data!);
      setActivityData(activityRes.data.data!);
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Falha ao carregar dados do dashboard',
        type: 'error',
        read: false,
      });
    }
  };

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Usuários Ativos',
      value: stats?.activeUsers || 0,
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Receita',
      value: formatCurrency(stats?.revenue || 0),
      icon: DollarSign,
      color: 'text-yellow-600',
    },
    {
      title: 'Crescimento',
      value: `${stats?.growth || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart data={revenueData} height={250} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={usersData} height={250} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={activityData} height={300} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
