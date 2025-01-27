import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';
import { BaseService } from '../base.service';
import { RolePermission } from '@prisma/client';
import { PrismaService } from '../data_access/prisma/prisma.service';
import { CreateRolePermissionsDto } from './dto/create-role_permissions.dto';

@Injectable()
export class RolePermissionService extends BaseService<RolePermission> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.rolePermission);
  }

  async createWithManyPermission(
    data: CreateRolePermissionsDto,
  ): Promise<RolePermission[]> {
    const result = await Promise.all(
      data.permission_id.map((permissionId) => {
        return super.create({
          role_id: data.role_id,
          permission_id: permissionId,
        } as RolePermission);
      }),
    );
    return result;
  }
}
