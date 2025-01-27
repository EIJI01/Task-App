import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../data_access/prisma/prisma.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
