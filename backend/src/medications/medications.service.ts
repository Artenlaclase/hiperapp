import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.medication.create({ data });
  }

  findAll() {
    return this.prisma.medication.findMany();
  }

  findOne(id: number) {
    return this.prisma.medication.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.medication.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.medication.delete({ where: { id } });
  }
}
