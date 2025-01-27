import { IsOptional, IsInt, IsDateString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsInt()
  role_id?: number;

  @IsOptional()
  @IsDateString()
  created_at?: Date;
}
