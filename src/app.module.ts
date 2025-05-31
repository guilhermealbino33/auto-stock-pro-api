import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { FipeModule } from './modules/fipe/fipe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    VehiclesModule,FipeModule
  ],
})
export class AppModule {}
