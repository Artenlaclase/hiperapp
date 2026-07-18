import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BloodPressureService } from './blood-pressure.service';
import { CreateBpDto } from './create-bp.dto';

@Controller('blood-pressure')
export class BloodPressureController {
  constructor(private bpService: BloodPressureService) {}

  @Post()
  create(@Body() dto: CreateBpDto) {
    return this.bpService.create(dto as any);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.bpService.findAllByUser(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bpService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.bpService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bpService.remove(Number(id));
  }
}
