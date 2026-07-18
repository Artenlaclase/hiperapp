import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './create-food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private foodsService: FoodsService) {}

  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foodsService.create(dto as any);
  }

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.foodsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(Number(id));
  }
}
