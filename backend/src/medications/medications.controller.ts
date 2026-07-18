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
}
