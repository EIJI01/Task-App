import { IsInt, IsOptional } from 'class-validator';

export class UpdateTaskCategoryDto {
  @IsOptional()
  @IsInt()
  task_id?: number;

  @IsOptional()
  @IsInt()
  category_id?: number;
}
