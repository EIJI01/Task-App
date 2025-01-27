import { Injectable } from '@nestjs/common';
import { PrismaService } from '../data_access/prisma/prisma.service';
import { Area, AreaThisMonth } from './dashboard.interface';
import { TaskService } from '../task/task.service';
import { Task } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prima: PrismaService,
    private readonly taskService: TaskService,
  ) {}

  async areaChart(): Promise<Area[]> {
    const tasks = await this.taskService.findAll();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const result = monthNames.map((month) => ({
      month,
      total_complete: 0,
      total_todo: 0,
    }));

    tasks.forEach((task) => {
      const monthIndex = new Date(task.updated_at).getMonth();
      const monthName = monthNames[monthIndex];

      const entry = result.find((item) => item.month === monthName);
      if (entry) {
        if (task.is_completed) {
          entry.total_complete += 1;
        } else {
          entry.total_todo += 1;
        }
      }
    });

    return result;
  }

  async areaPerMountChart(): Promise<AreaThisMonth[]> {
    const tasks = await this.taskService.findAll();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const filterTasks = tasks.filter(
      (t) =>
        new Date(t.created_at).getMonth() === thisMonth &&
        new Date(t.created_at).getFullYear() === thisYear,
    );

    const result = filterTasks.reduce((acc: AreaThisMonth[], curr: Task) => {
      const taskDate = new Date(curr.created_at).toISOString().split('T')[0];
      const existingEntry = acc.find((entry) => entry.date === taskDate);

      if (existingEntry) {
        if (curr.is_completed) {
          existingEntry.total_complete += 1;
        } else {
          existingEntry.total_todo += 1;
        }
      } else {
        acc.push({
          date: taskDate,
          total_complete: curr.is_completed ? 1 : 0,
          total_todo: curr.is_completed ? 0 : 1,
        });
      }

      return acc;
    }, []);

    const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(thisYear, thisMonth, day)
        .toISOString()
        .split('T')[0];
      if (!result.some((entry) => entry.date === date)) {
        result.push({
          date,
          total_complete: 0,
          total_todo: 0,
        });
      }
    }

    result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return result.filter(
      (entry) => new Date(entry.date).getMonth() === thisMonth,
    );
  }
}
