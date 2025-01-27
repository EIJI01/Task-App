import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BaseService } from './base.service';
import { ApiBody } from '@nestjs/swagger';

export class BaseController<T, CreateDto, UpdateDto> {
  constructor(private readonly service: BaseService<T>) {}

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<T | null> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBody({ type: Object })
  async create(@Body() data: CreateDto): Promise<T> {
    return this.service.create(data as unknown as T);
  }

  @Patch(':id')
  @ApiBody({ type: Object })
  async update(@Param('id') id: number, @Body() data: UpdateDto): Promise<T> {
    return this.service.update(id, data as unknown as Partial<T>);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: boolean }> {
    const response = await this.service.delete(id);
    return { success: response };
  }
}
