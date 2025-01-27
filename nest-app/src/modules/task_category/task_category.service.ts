import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { PrismaService } from 'src/modules/data_access/prisma/prisma.service';
import { TaskCategory } from '@prisma/client';

@Injectable()
export class TaskCategoryService extends BaseService<TaskCategory> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.taskCategory);
  }
}
