import { Injectable } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user_permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user_permission.dto';
import { BaseService } from '../base.service';
import { Permission, UserPermission } from '@prisma/client';
import { PrismaService } from '../data_access/prisma/prisma.service';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class UserPermissionService extends BaseService<UserPermission> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: PermissionService,
  ) {
    super(prisma.userPermission);
  }

  async findByUserId(userId: number): Promise<UserPermission[]> {
    return await this.prisma.userPermission.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async findByPermissionId(permissionId: number): Promise<UserPermission[]> {
    return await this.prisma.userPermission.findMany({
      where: {
        permission_id: permissionId,
      },
    });
  }

  async findPermissionByUserId(userId: number): Promise<Permission[]> {
    const userPermissions = await this.findByUserId(userId);
    const roles = await Promise.all(
      userPermissions.map((userPermission) => {
        return this.permissionService.findOne(userPermission.permission_id);
      }),
    );
    return roles;
  }
}
