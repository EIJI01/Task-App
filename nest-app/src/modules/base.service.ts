export class BaseService<T> {
  constructor(private readonly model: any) {}

  async findAll(): Promise<T[]> {
    return await this.model.findMany();
  }

  async findOne(id: number): Promise<T | null> {
    return await this.model.findUnique({ where: { id: id } });
  }

  async create(data: T): Promise<T> {
    return await this.model.create({ data: data });
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return await this.model.update({ where: { id: id }, data: data });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.model.delete({ where: { id: id } });
    return result ? true : false;
  }
}
