import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Task } from '@prisma/client';
import { SearchTitleTaskRequest } from './dto/search.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserDC } from '../user/user.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiQuery({ name: 'title', type: String })
  async searchTitleTask(
    @UserDC('id') userId: number,
    @Query() request: SearchTitleTaskRequest,
  ): Promise<Task[]> {
    return await this.searchService.searchTitleTask(userId, request.title);
  }

  @Get('complete-task')
  @ApiQuery({ name: 'title', type: String })
  async searchTitleWithCompleteTask(
    @UserDC('id') userId: number,
    @Query() request: SearchTitleTaskRequest,
  ): Promise<Task[]> {
    return await this.searchService.searchTitleWithCompleteTask(
      userId,
      request.title,
    );
  }
}
