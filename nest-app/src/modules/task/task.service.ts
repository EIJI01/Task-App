import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/data_access/prisma/prisma.service';
import { BaseService } from '../base.service';
import { Task } from '@prisma/client';
import { RedisService } from '../data_access/redis/redis.service';

const [PREFIX, KEY_ALL] = ['TASK', 'ALL'];

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super(prisma.task);
  }

  async findAll(): Promise<Task[]> {
    try {
      const redisTasks = await this.getCachedTasks(KEY_ALL);
      if (redisTasks) {
        console.log('Retrieved information from redis.');
        return redisTasks;
      }
      console.log('Retrieved information from database.');
      const tasks = await this.prisma.task.findMany();
      if (tasks.length > 0) {
        await this.updateCached(KEY_ALL, JSON.stringify(tasks));
      }

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }

    return await this.prisma.task.findMany();
  }

  async findWithPaginationByUser(
    userId: number,
    page: number | 'last' = 'last',
    limit: number,
  ): Promise<Task[]> {
    try {
      const redisTasks = await this.getCachedTasks(userId.toString());
      if (redisTasks) {
        console.log('Retrieved form cached.');
        if (page === 'last') {
          const totalItems = redisTasks.length;
          const lastPage = Math.ceil(totalItems / limit);
          const skip = (lastPage - 1) * limit;
          return redisTasks.slice(skip, skip + limit);
        }
        const skip = (page - 1) * limit;
        return redisTasks.slice(skip, skip + limit);
      }

      const totalItems = await this.prisma.task.count({
        where: {
          user_id: userId,
        },
      });

      const lastPage = Math.ceil(totalItems / limit);
      const currentPage = page === 'last' ? lastPage : page;

      const skip = (currentPage - 1) * limit;

      const tasks = await this.prisma.task.findMany({
        where: {
          user_id: userId,
        },
        skip: skip,
        take: limit,
        orderBy: { updated_at: 'asc' },
      });

      if (tasks.length > 0) {
        const allTasks = await this.prisma.task.findMany({
          where: {
            user_id: userId,
          },
          orderBy: { updated_at: 'asc' },
        });
        await this.updateCached(userId.toString(), JSON.stringify(allTasks));
      }

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      return [];
    }
  }

  async getAllWithUser(
    userId: number,
  ): Promise<{ success: boolean; number_of_task: number }> {
    const redisTasks = await this.getCachedTasks(userId.toString());
    if (redisTasks) {
      console.log('Retrieved from cached. get all');
      return { success: true, number_of_task: redisTasks.length };
    }

    const number = await this.prisma.task.count({
      where: {
        user_id: userId,
      },
    });
    return { success: true, number_of_task: number };
  }

  async getAllCompleteTasksWithUser(
    userId: number,
  ): Promise<{ success: boolean; number_of_task: number }> {
    const redisCached = await this.getCachedTasks(userId.toString());
    if (redisCached) {
      const redisTasks = redisCached.filter((t) => t.is_completed === true);
      console.log('Retrieved from cached. get all with complete task.');
      return { success: true, number_of_task: redisTasks.length };
    }

    const number = await this.prisma.task.count({
      where: {
        user_id: userId,
        is_completed: true,
      },
    });
    return { success: true, number_of_task: number };
  }

  async create(data: Task): Promise<Task> {
    console.log(data);
    const task = await this.prisma.task.create({ data });
    try {
      const redisUserTasks = await this.getCachedTasks(task.user_id.toString());
      if (redisUserTasks) {
        redisUserTasks.push(task);
        await this.updateCached(
          task.user_id.toString(),
          JSON.stringify(redisUserTasks),
        );
      }

      const redisAllTask = await this.getCachedTasks(KEY_ALL);
      if (redisAllTask) {
        redisAllTask.push(task);
        await this.updateCached(KEY_ALL, JSON.stringify(redisAllTask));
      }
    } catch (error) {
      console.error('Redis Error:', error.message);
    }
    return task;
  }

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const updateTask = await this.prisma.task.update({
      where: { id },
      data,
    });

    try {
      const redisUserTasks = await this.getCachedTasks(
        updateTask.user_id.toString(),
      );
      if (redisUserTasks) {
        const taskIndex = redisUserTasks.findIndex((t) => t.id === id);
        if (taskIndex !== -1) {
          redisUserTasks[taskIndex] = {
            ...redisUserTasks[taskIndex],
            ...updateTask,
          };
          await this.updateCached(
            updateTask.user_id.toString(),
            JSON.stringify(redisUserTasks),
          );
        }
      }
      const redisAllTasks = await this.getCachedTasks(KEY_ALL);
      if (redisAllTasks) {
        const taskIndex = redisAllTasks.findIndex((t) => t.id === id);
        if (taskIndex !== -1) {
          redisAllTasks[taskIndex] = {
            ...redisAllTasks[taskIndex],
            ...updateTask,
          };
          await this.updateCached(KEY_ALL, JSON.stringify(redisAllTasks));
        }
      }
    } catch (error) {
      console.error('Redis Error:', error.message);
    }
    return updateTask;
  }

  async delete(id: number): Promise<boolean> {
    const deletedTask = await this.prisma.task.delete({ where: { id: id } });
    try {
      const redisUserTasks = await this.getCachedTasks(
        deletedTask.user_id.toString(),
      );
      if (redisUserTasks) {
        const filteredTasks = redisUserTasks.filter((t) => t.id !== id);
        if (filteredTasks.length > 0) {
          await this.updateCached(
            deletedTask.user_id.toString(),
            JSON.stringify(filteredTasks),
          );
        } else {
          await this.redis.delete(PREFIX, deletedTask.user_id.toString());
        }
      }
      const redisAllTasks = await this.getCachedTasks(KEY_ALL);
      if (redisAllTasks) {
        const filteredTasks = redisAllTasks.filter((t) => t.id !== id);
        if (filteredTasks.length > 0) {
          await this.updateCached(KEY_ALL, JSON.stringify(filteredTasks));
        } else {
          await this.redis.delete(PREFIX, KEY_ALL);
        }
      }
      return true;
    } catch (error) {
      console.error('Redis Error:', error.message);
    }
  }

  async searchByTitle(userId: number, query: string): Promise<Task[]> {
    try {
      const redisUserTasks = await this.getCachedTasks(userId.toString());

      if (redisUserTasks) {
        const filteredTasks = redisUserTasks.filter((t) =>
          t.title.toLowerCase().includes(query.toLowerCase()),
        );
        console.log('Retrieved information from redis.');
        return filteredTasks;
      }
    } catch (error) {
      console.error('Error searching tasks:', error.message);
    }

    console.log('Retrieved information from database.');
    const queryTasks = await this.prisma.task.findMany({
      where: {
        user_id: userId,
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return queryTasks;
  }

  async searchByTitleWithCompleteTask(
    userId: number,
    query: string,
  ): Promise<Task[]> {
    try {
      const redisCached = await this.getCachedTasks(userId.toString());

      if (redisCached) {
        const redisUserTasks = redisCached.filter(
          (t) => t.is_completed === true,
        );
        const filteredTasks = redisUserTasks.filter((t) =>
          t.title.toLowerCase().includes(query.toLowerCase()),
        );
        console.log('Retrieved information from redis.');
        return filteredTasks;
      }
    } catch (error) {
      console.error('Error searching tasks:', error.message);
    }

    console.log('Retrieved information from database.');
    const queryTasks = await this.prisma.task.findMany({
      where: {
        user_id: userId,
        title: {
          contains: query,
          mode: 'insensitive',
        },
        is_completed: true,
      },
    });
    return queryTasks;
  }

  async findCompleteTaskWithUser(
    userId: number,
    page: number | 'last' = 'last',
    limit: number,
  ): Promise<Task[]> {
    try {
      const redisCached = await this.getCachedTasks(userId.toString());
      if (redisCached) {
        console.log('Retrieved form cached.');
        const redisTasks = redisCached.filter((t) => t.is_completed === true);
        if (page === 'last') {
          const totalItems = redisTasks.length;
          const lastPage = Math.ceil(totalItems / limit);
          const skip = (lastPage - 1) * limit;
          return redisTasks.slice(skip, skip + limit);
        }
        const skip = (page - 1) * limit;

        return redisTasks.slice(skip, skip + limit);
      }

      const totalItems = await this.prisma.task.count({
        where: {
          user_id: userId,
          is_completed: true,
        },
      });

      const lastPage = Math.ceil(totalItems / limit);
      const currentPage = page === 'last' ? lastPage : page;

      const skip = (currentPage - 1) * limit;

      const tasks = await this.prisma.task.findMany({
        where: {
          user_id: userId,
          is_completed: true,
        },
        skip: skip,
        take: limit,
        orderBy: { updated_at: 'asc' },
      });

      if (tasks.length > 0) {
        const allTasks = await this.prisma.task.findMany({
          where: {
            user_id: userId,
          },
          orderBy: { updated_at: 'asc' },
        });
        await this.updateCached(userId.toString(), JSON.stringify(allTasks));
      }

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      return [];
    }
  }

  private async updateCached(key: string, data: string): Promise<void> {
    await this.redis.setWithExpiry(PREFIX, key, data, 3600);
  }

  private async getCachedTasks(key: string): Promise<Task[] | null> {
    try {
      const redisTasks = await this.redis.get(PREFIX, key);
      return redisTasks ? JSON.parse(redisTasks) : null;
    } catch (error) {
      console.error('Error retrieving tasks from Redis:', error.message);
      return null;
    }
  }
}
