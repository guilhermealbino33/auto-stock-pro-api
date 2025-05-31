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

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const offset = (parseInt(page) - 1) * parseInt(limit)
    return this.vehiclesService.getAllVehicles(parseInt(limit), offset)
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() data: any) {
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
    @Body() data: any,
    @Req() req: Request,
  ) {
    const user = req.body.user
    return this.vehiclesService.updateVehicle(id, user.userId, data)
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const valid = ['available', 'reserved', 'sold']
    if (!valid.includes(status)) {
      throw new HttpException('Status inválido', HttpStatus.BAD_REQUEST)
    }
    await this.vehiclesService.updateVehicleStatus(id, status)
    return { success: true }
  }
}
