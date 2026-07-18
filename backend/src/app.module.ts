import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { BloodPressureModule } from './blood-pressure/blood-pressure.module';
import { FoodsModule } from './foods/foods.module';
import { FoodLogsModule } from './food-logs/food-logs.module';
import { MedicationsModule } from './medications/medications.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, BloodPressureModule, FoodsModule, FoodLogsModule, MedicationsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
