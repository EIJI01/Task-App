import { Controller } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { TaskCategoryService } from './task_category.service';
import { TaskCategory } from '@prisma/client';
import { CreateTaskCategoryDto } from './dto/create-task-category.dto';
import { UpdateTaskCategoryDto } from './dto/update-task-category.dto';

@Controller('task-category')
export class TaskCategoryController extends BaseController<
  TaskCategory,
  CreateTaskCategoryDto,
  UpdateTaskCategoryDto
> {
  constructor(private readonly taskCategoryService: TaskCategoryService) {
    super(taskCategoryService);
  }
}
