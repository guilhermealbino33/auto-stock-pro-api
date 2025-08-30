import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { FipeModule } from './modules/fipe/fipe.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    VehiclesModule,
    FipeModule,
  ],
})
export class AppModule {}
