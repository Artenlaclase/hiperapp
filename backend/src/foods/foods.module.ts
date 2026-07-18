import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FoodsService],
  controllers: [FoodsController]
})
export class FoodsModule {}
