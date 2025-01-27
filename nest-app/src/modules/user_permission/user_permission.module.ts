import { Module } from '@nestjs/common';
import { UserPermissionService } from './user_permission.service';
import { UserPermissionController } from './user_permission.controller';
import { PrismaModule } from '../data_access/prisma/prisma.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [PrismaModule, PermissionModule],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
  exports: [UserPermissionService],
})
export class UserPermissionModule {}
