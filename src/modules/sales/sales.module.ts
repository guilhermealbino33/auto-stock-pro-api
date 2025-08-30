import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), VehiclesModule, CustomersModule],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
