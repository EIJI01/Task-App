import { Controller } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { UserRole } from '@prisma/client';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';
import { UserRoleService } from './user_role.service';

@Controller('user-role')
export class UserRoleController extends BaseController<
  UserRole,
  CreateUserRoleDto,
  UpdateUserRoleDto
> {
  constructor(private readonly userRoleService: UserRoleService) {
    super(userRoleService);
  }
}
