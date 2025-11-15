'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PieChart } from '@/components/charts/PieChart';
import { LineChart } from '@/components/charts/LineChart';

export default function ReportsPage() {
  const userDistribution = [
    { name: 'Admin', value: 30 },
    { name: 'Usuários', value: 70 },
  ];

  const performanceData = [
    { name: 'Jan', value: 85 },
    { name: 'Fev', value: 88 },
    { name: 'Mar', value: 92 },
    { name: 'Abr', value: 89 },
    { name: 'Mai', value: 95 },
    { name: 'Jun', value: 98 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise e métricas do sistema</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={userDistribution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance do Sistema (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={performanceData} color="#10b981" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
