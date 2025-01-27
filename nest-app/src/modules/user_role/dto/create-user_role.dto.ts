import { IsInt, IsString } from 'class-validator';

export class CreateUserRoleDto {
  @IsInt()
  user_id: number;

  @IsInt()
  role_id: number;
}
