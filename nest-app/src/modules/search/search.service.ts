import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskService } from '../task/task.service';
import { Task } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly taskService: TaskService) {}

  async searchTitleTask(userId: number, query: string): Promise<Task[]> {
    const result = await this.taskService.searchByTitle(userId, query);
    if (result.length === 0) throw new NotFoundException('No result found.');
    return result;
  }

  async searchTitleWithCompleteTask(
    userId: number,
    query: string,
  ): Promise<Task[]> {
    const result = await this.taskService.searchByTitleWithCompleteTask(
      userId,
      query,
    );
    if (result.length === 0) throw new NotFoundException('No result found.');
    return result;
  }
}
