import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInfo } from '../user/user.interface';
import { UpdateUserProfileDto } from './dto/edit-profile.dto';
import { User } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async getProfile(id: number): Promise<UserInfo> {
    return await this.userService.findUserFullInfoById(id);
  }

  async editProfile(
    userId: number,
    request: Partial<UpdateUserProfileDto>,
  ): Promise<User> {
    return await this.userService.update(userId, request);
  }
}
