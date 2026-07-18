import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FoodLogsService } from './food-logs.service';
import { CreateFoodLogDto } from './create-foodlog.dto';

@Controller('food-logs')
export class FoodLogsController {
  constructor(private logsService: FoodLogsService) {}

  @Post()
  create(@Body() dto: CreateFoodLogDto) {
    return this.logsService.create(dto as any);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.logsService.findAllByUser(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.logsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsService.remove(Number(id));
  }
}
