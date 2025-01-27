import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserRoleModule } from '../user_role/user_role.module';
import { RoleModule } from '../role/role.module';
import { RedisModule } from '../data_access/redis/redis.module';

@Module({
  imports: [UserModule, UserRoleModule, RoleModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
