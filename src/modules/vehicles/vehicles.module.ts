import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
