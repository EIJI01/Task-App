import { Body, Controller, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { BaseController } from '../base.controller';
import { Permission } from '@prisma/client';
import { ApiBody } from '@nestjs/swagger';
import { Public } from '../guards/auth.guard';

@Public()
@Controller('permission')
export class PermissionController extends BaseController<
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor(private readonly permissionService: PermissionService) {
    super(permissionService);
  }

  @Post()
  @ApiBody({ type: Object })
  async create(@Body() data: CreatePermissionDto): Promise<Permission> {
    return super.create(data);
  }
}
