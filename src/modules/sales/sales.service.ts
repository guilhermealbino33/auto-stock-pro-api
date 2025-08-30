import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale, SaleStatus } from './entities/sale.entity';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CustomersService } from '../customers/customers.service';
import { VehicleStatusEnum } from '../vehicles/enums/vehicle.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    private vehiclesService: VehiclesService,
    private customersService: CustomersService
  ) {}

  async create(createSaleDto: CreateSaleDTO, userId: number): Promise<Sale> {
    const vehicle = await this.vehiclesService.findOne({
      id: createSaleDto.vehicle_id,
    });
    if (vehicle.status !== 'available') {
      throw new BadRequestException('Veículo não está disponível para venda');
    }

    // Validar se cliente existe
    await this.customersService.findOne(createSaleDto.customer_id);

    // Validar veículo de troca se fornecido
    let tradeInVehicle = null;
    if (createSaleDto.trade_in_vehicle_plate) {
      tradeInVehicle = await this.vehiclesService.findOne({
        plate: createSaleDto.trade_in_vehicle_plate,
      });

      if (!tradeInVehicle) {
        /**
         * @todo
         *
         * implementar
         */
      }
    }

    // Calcular margem de lucro
    const profitProjection = this.calculateProfitProjection(
      createSaleDto.agreed_price,
      vehicle.price_fipe || vehicle.price,
      createSaleDto.trade_in_value || 0
    );

    const sale = this.salesRepository.create({
      ...createSaleDto,
      profit_projection: profitProjection,
      created_by_id: userId,
    });

    const savedSale = await this.salesRepository.save(sale);

    // Reservar o veículo
    await this.vehiclesService.update(createSaleDto.vehicle_id, {
      status: VehicleStatusEnum.RESERVADO,
    });

    return this.findOne(savedSale.id);
  }

  async findAll(): Promise<Sale[]> {
    return this.salesRepository.find({
      relations: ['vehicle', 'customer', 'trade_in_vehicle', 'created_by'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['vehicle', 'customer', 'trade_in_vehicle', 'created_by'],
    });

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.salesRepository.findOne({ where: { id } });

    if (!sale) {
      throw new NotFoundException('Venda não encontrada.');
    }

    // Recalcular margem se preços mudaram
    if (updateSaleDto.agreed_price || updateSaleDto.trade_in_value) {
      const newAgreedPrice = updateSaleDto.agreed_price || sale.agreed_price;
      const newTradeInValue =
        updateSaleDto.trade_in_value || sale.trade_in_value || 0;

      sale.profit_projection = this.calculateProfitProjection(
        newAgreedPrice,
        sale.vehicle.price_fipe || sale.vehicle.price,
        newTradeInValue
      );
    }

    if (updateSaleDto.status) {
      await this.updateVehicleStatusBasedOnSale(sale, updateSaleDto.status);
    }

    Object.assign(sale, updateSaleDto);

    await this.salesRepository.save(sale);

    return sale;
  }

  async remove(id: number): Promise<void> {
    const sale = await this.findOne(id);

    // Liberar veículo se venda for cancelada/removida
    if (sale.status !== SaleStatus.COMPLETED) {
      await this.vehiclesService.update(sale.vehicle_id, {
        status: VehicleStatusEnum.DISPONIVEL,
      });
    }

    await this.salesRepository.remove(sale);
  }

  async getSalesReport(): Promise<any> {
    const totalSales = await this.salesRepository.count({
      where: { status: SaleStatus.COMPLETED },
    });

    const totalRevenue = await this.salesRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.agreed_price)', 'total')
      .where('sale.status = :status', { status: SaleStatus.COMPLETED })
      .getRawOne();

    const totalProfit = await this.salesRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.profit_projection)', 'total')
      .where('sale.status = :status', { status: SaleStatus.COMPLETED })
      .getRawOne();

    return {
      total_sales: totalSales,
      total_revenue: parseFloat(totalRevenue.total) || 0,
      total_profit: parseFloat(totalProfit.total) || 0,
      average_profit_margin:
        totalSales > 0
          ? ((parseFloat(totalProfit.total) || 0) /
              (parseFloat(totalRevenue.total) || 1)) *
            100
          : 0,
    };
  }

  private calculateProfitProjection(
    salePrice: number,
    vehicleValue: number,
    tradeInValue: number = 0
  ): number {
    return salePrice - vehicleValue + tradeInValue;
  }

  private async updateVehicleStatusBasedOnSale(
    sale: Sale,
    newStatus: SaleStatus
  ): Promise<void> {
    let vehicleStatus = VehicleStatusEnum.DISPONIVEL;

    switch (newStatus) {
      case SaleStatus.PENDING:
        vehicleStatus = VehicleStatusEnum.RESERVADO;
        break;
      case SaleStatus.COMPLETED:
        vehicleStatus = VehicleStatusEnum.VENDIDO;
        break;
      case SaleStatus.CANCELLED:
        vehicleStatus = VehicleStatusEnum.DISPONIVEL;
        break;
    }

    await this.vehiclesService.update(sale.vehicle_id, {
      status: vehicleStatus,
    });
  }
}
