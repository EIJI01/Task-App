import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/data_access/prisma/prisma.module';
import { UserRoleService } from './user_role.service';
import { UserRoleController } from './user_role.controller';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [PrismaModule, RoleModule, UserModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
