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
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@/modules/auth/guards/auth.guard'
import { Request } from 'express'
import { VehiclesService } from './vehicles.service'
import { FindAllVehiclesDTO, CreateVehicleDTO, UpdateVehicleDTO, UpdateVehicleStatusDTO } from './dto'


@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAll(@Query() query: FindAllVehiclesDTO) {
    const { page = 1, limit = 20 } = query
    const offset = (page - 1) * limit
    return this.vehiclesService.getAllVehicles(limit, offset)
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() data: CreateVehicleDTO) {
    const user = req.body.user
    return this.vehiclesService.createVehicle(user.userId, data)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.body.user
    const vehicle = await this.vehiclesService.getVehicleById(id, user.userId)
    if (!vehicle) {
      throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND)
    }
    return vehicle
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateVehicleDTO,
    @Req() req: Request,
  ) {
    const user = req.body.user
    return this.vehiclesService.updateVehicle(id, user.userId, data)
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateVehicleStatusDTO,
  ) {
    await this.vehiclesService.updateVehicleStatus(id, data.status)
    return { success: true }
  }
}
