import { Vehicle } from '@/lib/database';
import { IsString, IsIn } from 'class-validator';

export class UpdateVehicleStatusDTO {
  @IsString()
  @IsIn(['available', 'reserved', 'sold'])
  status: Vehicle['status'];
}
