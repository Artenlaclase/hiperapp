import { Module } from '@nestjs/common';
import { BloodPressureService } from './blood-pressure.service';
import { BloodPressureController } from './blood-pressure.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BloodPressureService],
  controllers: [BloodPressureController]
})
export class BloodPressureModule {}
