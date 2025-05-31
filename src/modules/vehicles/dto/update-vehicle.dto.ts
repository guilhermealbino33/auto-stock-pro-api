import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDTO } from './create-vehicle.dto';

export class UpdateVehicleDTO extends PartialType(CreateVehicleDTO) {}
