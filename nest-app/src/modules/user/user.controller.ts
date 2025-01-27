import { Body, Controller, Get, Post } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Authorize } from '../guards/role.guard';
import { UserRolePermission } from './user.interface';
import { UserDC } from './user.decorator';

@Controller('users')
export class UserController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Authorize({ roles: ['ADMIN'] })
  @Post()
  async create(@Body() data: CreateUserDto): Promise<User> {
    return await super.create(data);
  }

  @Get('roles-permissions')
  async getUserRolePermission(
    @UserDC('id') userId: number,
  ): Promise<UserRolePermission> {
    console.log(userId);
    return await this.userService.findUserRolePermission(userId);
  }
}
