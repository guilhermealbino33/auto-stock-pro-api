import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { Request } from 'express';
import { VehiclesService } from '../services/vehicles.service';
import { FindAllVehiclesDTO, CreateVehicleDTO, UpdateVehicleDTO } from '../dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAll(@Query() query: FindAllVehiclesDTO) {
    const { page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;
    return this.vehiclesService.paginate(limit, offset);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() data: CreateVehicleDTO) {
    const user = req.body.user;
    return this.vehiclesService.create(user.userId, data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.vehiclesService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UpdateVehicleDTO) {
    return this.vehiclesService.update(id, data);
  }
}
