import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { PrismaService } from 'src/modules/data_access/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserInfo, UserRolePermission } from './user.interface';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  async findAll(): Promise<User[]> {
    return (await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profile_picture: true,
        created_at: true,
        updated_at: true,
      },
    })) as User[];
  }

  async findOne(id: number): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        profile_picture: true,
        created_at: true,
        updated_at: true,
      },
    })) as User;
  }

  async findByUsernameOrEmail(username: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email: username,
      },
    });
  }

  async findUserFullInfoById(userId: number): Promise<UserInfo> {
    return (await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_picture: true,
        created_at: true,
        updated_at: true,
        UserRole: {
          select: {
            user_id: true,
            role_id: true,
            created_at: true,
            Role: {
              select: {
                id: true,
                role_name: true,
                created_at: true,
                updated_at: true,
                RolePermission: {
                  select: {
                    role_id: true,
                    permission_id: true,
                    created_at: true,
                    Permission: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        UserPermission: {
          select: {
            user_id: true,
            permission_id: true,
            created_at: true,
            Permission: {
              select: {
                id: true,
                name: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    })) as UserInfo;
  }

  async findUserRolePermission(userId: number): Promise<UserRolePermission> {
    const user = await this.findUserFullInfoById(userId);
    const roles = user.UserRole.map((ur) => ur.Role.role_name);
    const roles_permissions = user.UserRole.reduce(
      (acc, userRole) => {
        acc[userRole.Role.role_name] = userRole.Role.RolePermission.map(
          (rp) => rp.Permission.name,
        );
        return acc;
      },
      {} as { [role: string]: string[] },
    );

    const user_permissions = user.UserPermission.map(
      (userPermission) => userPermission.Permission.name,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
      updated_at: user.updated_at,
      roles: roles,
      roles_permissions: roles_permissions,
      user_permissions: user_permissions,
    } as UserRolePermission;
  }
}
