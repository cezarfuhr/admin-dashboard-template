import { AuditLog, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export interface PaginationParams {
  page?: number;
  limit?: number;
  userId?: string;
  entity?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AuditLogModel {
  static async create(logData: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    return await prisma.auditLog.create({
      data: logData,
    });
  }

  static async findAll(params?: PaginationParams): Promise<PaginatedResponse<AuditLog>> {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};
    if (params?.userId) where.userId = params.userId;
    if (params?.entity) where.entity = params.entity;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findByEntity(
    entity: string,
    entityId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = { entity, entityId };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
