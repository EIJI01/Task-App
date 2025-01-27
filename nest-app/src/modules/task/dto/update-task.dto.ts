import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_completed?: boolean;

  @IsOptional()
  completed_at?: Date;
}
