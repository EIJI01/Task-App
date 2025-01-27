import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { PrismaService } from 'src/modules/data_access/prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.category);
  }
}
