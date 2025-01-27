import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Permission } from '@prisma/client';
import { PrismaService } from '../data_access/prisma/prisma.service';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.permission);
  }
}
