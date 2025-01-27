import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { PrismaService } from 'src/modules/data_access/prisma/prisma.service';
import { Role, User, UserRole } from '@prisma/client';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserRoleService extends BaseService<UserRole> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {
    super(prisma.userRole);
  }

  async findByUserId(userId: number): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async findByRoleId(roleId: number): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({
      where: {
        role_id: roleId,
      },
    });
  }

  async findRoleByUser(userId: number): Promise<Role[]> {
    const userRoles = await this.findByUserId(userId);
    const roles = await Promise.all(
      userRoles.map((userRole) => {
        return this.roleService.findOne(userRole.role_id);
      }),
    );
    return roles;
  }

  async findUserByRole(roleId: number): Promise<User[]> {
    const userRoles = await this.findByRoleId(roleId);
    const users = await Promise.all(
      userRoles.map((userRole) => {
        return this.userService.findOne(userRole.user_id);
      }),
    );
    return users;
  }
}
