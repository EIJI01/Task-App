import { Controller, Get, Param, Query } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { TaskService } from './task.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskByUserRequest } from './dto/get-task.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserDC } from '../user/user.decorator';

@Controller('task')
export class TaskController extends BaseController<
  Task,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }

  @Get('getAll-tasks-user')
  async findAllWithUserTasks(
    @UserDC('id') userId: number,
  ): Promise<{ success: boolean; number_of_task: number }> {
    return await this.taskService.getAllWithUser(userId);
  }

  @Get('getAll-tasks-complete')
  async findAllWithUserCompleteTasks(
    @UserDC('id') userId: number,
  ): Promise<{ success: boolean; number_of_task: number }> {
    return await this.taskService.getAllCompleteTasksWithUser(userId);
  }

  @Get('user')
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findAllWithUser(
    @UserDC('id') userId: number,
    @Query() request: GetTaskByUserRequest,
  ): Promise<Task[]> {
    return await this.taskService.findWithPaginationByUser(
      userId,
      request.page,
      request.limit,
    );
  }

  @Get('complete-task')
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  async findAllCompleteByUser(
    @UserDC('id') userId: number,
    @Query() query: GetTaskByUserRequest,
  ): Promise<Task[]> {
    return await this.taskService.findCompleteTaskWithUser(
      userId,
      query.page,
      query.limit,
    );
  }
}
