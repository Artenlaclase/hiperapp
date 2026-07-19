import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './create-medication.dto';

@Controller('medications')
export class MedicationsController {
  constructor(private medsService: MedicationsService) {}

  @Post()
  create(@Body() dto: CreateMedicationDto) {
    return this.medsService.create(dto as any);
  }

  @Get()
  findAll() {
    return this.medsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.medsService.findAllByUser(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.medsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medsService.remove(Number(id));
  }

  @Post(':id/alarms')
  createAlarm(@Param('id') medicationId: string, @Body() body: { alarmTime: string, daysOfWeek: string, userId?: number }) {
    return this.medsService.createAlarm(Number(medicationId), body);
  }

  @Put(':medicationId/alarms/:alarmId')
  updateAlarm(@Param('medicationId') medicationId: string, @Param('alarmId') alarmId: string, @Body() body: any) {
    return this.medsService.updateAlarm(Number(alarmId), body);
  }

  @Delete(':medicationId/alarms/:alarmId')
  removeAlarm(@Param('medicationId') medicationId: string, @Param('alarmId') alarmId: string) {
    return this.medsService.removeAlarm(Number(alarmId));
  }

  @Post(':id/logs')
  createLog(@Param('id') medicationId: string, @Body() body: { userId: number, takenAt?: string, status: string }) {
    const takenAt = body.takenAt ? new Date(body.takenAt) : new Date();
    return this.medsService.createLog(Number(medicationId), Number(body.userId), takenAt, body.status);
  }
}
