import { IsNumber } from 'class-validator';

export class CreateUserPermissionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  permission_id: number;
}
