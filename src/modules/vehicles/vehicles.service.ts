import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDTO, UpdateVehicleDTO } from './dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>
  ) {}

  async create(userId: string, data: CreateVehicleDTO) {
    /**
     * @todo
     * - adicionar userId
     * - como forma de action history
     * - a placa do veículo deve ser única
     * - historico de venda, aquisicao, será por placa
     */

    const vehicle = this.vehiclesRepository.create(data);

    await this.vehiclesRepository.save(vehicle);

    return vehicle;
  }

  async paginate(limit: number, offset: number) {
    return this.vehiclesRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(data: FindOptionsWhere<Vehicle>) {
    const vehicle = this.vehiclesRepository.findOne({ where: data });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado.');
    }

    return vehicle;
  }

  async update(
    id: number,
    {
      brand,
      color,
      mileage,
      model,
      plate,
      price,
      price_fipe,
      price_fipe_date,
      year,
      year_model,
      status,
    }: UpdateVehicleDTO
  ) {
    /**
     * @todo
     * - adicionar userId
     * - adicionar regras de negócio
     */

    return this.vehiclesRepository.update(id, {
      brand,
      color,
      mileage,
      model,
      plate,
      price,
      price_fipe,
      price_fipe_date,
      year,
      year_model,
      status,
    });
  }
}
