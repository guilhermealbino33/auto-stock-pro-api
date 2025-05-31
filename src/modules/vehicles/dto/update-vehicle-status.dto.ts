
import { IsString, IsIn } from 'class-validator'

export class UpdateVehicleStatusDTO {
  @IsString()
  @IsIn(['available', 'reserved', 'sold'])
  status: string
}
