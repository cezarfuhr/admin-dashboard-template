import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

export type UserResponse = Omit<User, 'password'>;

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserModel {
  static async findAll(params?: PaginationParams): Promise<PaginatedResponse<UserResponse>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findById(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
    avatar?: string;
  }): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async update(
    id: string,
    userData: {
      name?: string;
      email?: string;
      password?: string;
      role?: 'ADMIN' | 'USER';
      avatar?: string;
    }
  ): Promise<UserResponse | null> {
    const updateData: any = { ...userData };

    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async count(): Promise<number> {
    return await prisma.user.count();
  }

  static async getActiveUsers(): Promise<number> {
    // For now, return 70% of users as active (mock)
    // In production, you would track last login time
    const total = await this.count();
    return Math.floor(total * 0.7);
  }
}
