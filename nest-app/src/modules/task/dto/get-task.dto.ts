import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetTaskByUserRequest {
  @Type(() => Number)
  @IsOptional()
  page: number;

  @Type(() => Number)
  @IsOptional()
  limit: number = 10;
}
