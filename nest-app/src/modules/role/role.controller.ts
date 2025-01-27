import { Controller } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { Role } from '@prisma/client';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from '../guards/auth.guard';

@Public()
@Controller('role')
export class RoleController extends BaseController<
  Role,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }
}
