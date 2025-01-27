import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { PrismaService } from 'src/modules/data_access/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.role);
  }

  async findRoleByName(name: string): Promise<Role> | null {
    return this.prisma.role.findUnique({
      where: {
        role_name: name.toUpperCase(),
      },
    });
  }
}
