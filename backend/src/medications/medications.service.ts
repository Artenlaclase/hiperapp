import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.medication.create({
      data: {
        name: data.name,
        dosage: data.dosage,
        instructions: data.instructions,
        userId: Number(data.userId),
      }
    });
  }

  findAll() {
    return this.prisma.medication.findMany({
      include: { alarms: true }
    });
  }

  findAllByUser(userId: number) {
    return this.prisma.medication.findMany({
      where: { userId },
      include: { alarms: true }
    });
  }

  findOne(id: number) {
    return this.prisma.medication.findUnique({
      where: { id },
      include: { alarms: true }
    });
  }

  update(id: number, data: any) {
    return this.prisma.medication.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.medication.delete({ where: { id } });
  }

  createAlarm(medicationId: number, data: any) {
    return this.prisma.medicationAlarm.create({
      data: {
        medicationId,
        alarmTime: data.alarmTime,
        daysOfWeek: data.daysOfWeek,
        userId: data.userId ? Number(data.userId) : null,
        active: data.active !== undefined ? Boolean(data.active) : true
      }
    });
  }

  updateAlarm(id: number, data: any) {
    return this.prisma.medicationAlarm.update({
      where: { id },
      data: {
        alarmTime: data.alarmTime,
        daysOfWeek: data.daysOfWeek,
        active: data.active !== undefined ? Boolean(data.active) : undefined
      }
    });
  }

  removeAlarm(id: number) {
    return this.prisma.medicationAlarm.delete({
      where: { id }
    });
  }

  createLog(medicationId: number, userId: number, takenAt: Date, status: string) {
    return this.prisma.medicationLog.create({
      data: {
        medicationId,
        userId,
        takenAt,
        status
      }
    });
  }
}
