import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FoodLogsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.foodLog.create({ data });
  }

  findAllByUser(userId: number) {
    return this.prisma.foodLog.findMany({ where: { userId }, orderBy: { consumedAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.foodLog.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.foodLog.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.foodLog.delete({ where: { id } });
  }
}
