import { Body, Controller, Post } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';
import { BaseController } from '../base.controller';
import { RolePermission } from '@prisma/client';
import { Public } from '../guards/auth.guard';
import { CreateRolePermissionsDto } from './dto/create-role_permissions.dto';

@Public()
@Controller('role-permission')
export class RolePermissionController extends BaseController<
  RolePermission,
  CreateRolePermissionDto,
  UpdateRolePermissionDto
> {
  constructor(private readonly rolePermissionService: RolePermissionService) {
    super(rolePermissionService);
  }

  @Post('create-many-permission')
  async createWithManyPermission(
    @Body() request: CreateRolePermissionsDto,
  ): Promise<RolePermission[]> {
    return await this.rolePermissionService.createWithManyPermission(request);
  }
}
