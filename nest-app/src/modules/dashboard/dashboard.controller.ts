import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Authorize } from '../guards/role.guard';
import { Area, AreaThisMonth } from './dashboard.interface';

@Authorize({ roles: ['ADMIN'] })
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('area-chart')
  async areaChart(): Promise<Area[]> {
    return await this.dashboardService.areaChart();
  }

  @Get('area-thisMonth-chart')
  async areaThisMonthChart(): Promise<AreaThisMonth[]> {
    return await this.dashboardService.areaPerMountChart();
  }
}
