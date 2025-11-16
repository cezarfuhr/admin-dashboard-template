export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse extends Omit<User, 'password'> {}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  growth: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
