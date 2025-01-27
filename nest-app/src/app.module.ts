import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { CategoryModule } from './modules/category/category.module';
import { TaskCategoryModule } from './modules/task_category/task_category.module';
import { AuthModule } from './modules/authentications/auth.module';
import { RoleModule } from './modules/role/role.module';
import { UserRoleModule } from './modules/user_role/user_role.module';
import { AuthGuard } from './modules/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { AuthorizeGuard } from './modules/guards/role.guard';
import { ProfileModule } from './modules/profile/profile.module';
import { SearchModule } from './modules/search/search.module';
import { UploadFileModule } from './modules/upload_files/upload-files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PermissionModule } from './modules/permission/permission.module';
import { RolePermissionModule } from './modules/role_permission/role_permission.module';
import { UserPermissionModule } from './modules/user_permission/user_permission.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    CategoryModule,
    TaskCategoryModule,
    RoleModule,
    UserRoleModule,
    ProfileModule,
    SearchModule,
    UploadFileModule,
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: process.env.ALGORITHM as Algorithm,
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PermissionModule,
    UserPermissionModule,
    RolePermissionModule,
    DashboardModule,
  ],

  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: AuthorizeGuard },
  ],
})
export class AppModule {}
