import { Controller } from '@nestjs/common';
import { UserPermissionService } from './user_permission.service';
import { CreateUserPermissionDto } from './dto/create-user_permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user_permission.dto';
import { BaseController } from '../base.controller';
import { UserPermission } from '@prisma/client';

@Controller('user-permission')
export class UserPermissionController extends BaseController<
  UserPermission,
  CreateUserPermissionDto,
  UpdateUserPermissionDto
> {
  constructor(private readonly userPermissionService: UserPermissionService) {
    super(userPermissionService);
  }
}
