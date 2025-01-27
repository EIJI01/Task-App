import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDC } from '../user/user.decorator';
import { UserInfo } from '../user/user.interface';
import { UpdateUserProfileDto } from './dto/edit-profile.dto';
import { ApiBody } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@UserDC('id') id: number): Promise<UserInfo> {
    return await this.profileService.getProfile(id);
  }

  @Patch('edit')
  @ApiBody({ type: Object })
  async editProfile(
    @UserDC('id') userId: number,
    @Body() request: Partial<UpdateUserProfileDto>,
  ): Promise<User> {
    return await this.profileService.editProfile(userId, request);
  }
}
