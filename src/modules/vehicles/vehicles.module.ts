import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    ConfigModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
