import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaModule } from 'src/modules/data_access/prisma/prisma.module';
import { RedisModule } from '../data_access/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
