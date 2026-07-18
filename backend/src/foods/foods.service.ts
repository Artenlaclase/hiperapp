import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.food.create({ data });
  }

  findAll() {
    return this.prisma.food.findMany();
  }

  findOne(id: number) {
    return this.prisma.food.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.food.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.food.delete({ where: { id } });
  }
}
