import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskCategoryController } from './task_category.controller';
import { TaskCategoryService } from './task_category.service';
import { PrismaModule } from 'src/modules/data_access/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskCategoryController],
  providers: [TaskCategoryService],
  exports: [TaskCategoryService],
})
export class TaskCategoryModule {}
