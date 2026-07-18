import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BloodPressureService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.bloodPressureRecord.create({ data });
  }

  findAllByUser(userId: number) {
    return this.prisma.bloodPressureRecord.findMany({ where: { userId }, orderBy: { measuredAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.bloodPressureRecord.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.bloodPressureRecord.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.bloodPressureRecord.delete({ where: { id } });
  }
}
