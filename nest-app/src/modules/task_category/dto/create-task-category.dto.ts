import { IsInt } from 'class-validator';

export class CreateTaskCategoryDto {
  @IsInt()
  task_id: number;

  @IsInt()
  category_id: number;
}
