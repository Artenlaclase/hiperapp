import { Module } from '@nestjs/common';
import { FoodLogsService } from './food-logs.service';
import { FoodLogsController } from './food-logs.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FoodLogsService],
  controllers: [FoodLogsController]
})
export class FoodLogsModule {}
