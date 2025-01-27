import { IsInt, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  user_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  is_completed?: boolean;
}
