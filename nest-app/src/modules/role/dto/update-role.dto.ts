import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  role_name?: string;

  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @IsOptional()
  @IsDateString()
  updated_at?: Date;
}
