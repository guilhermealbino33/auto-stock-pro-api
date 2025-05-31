import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { FipeService } from './fipe.service';

@Controller('fipe')
export class FipeController {
  constructor(private readonly fipeService: FipeService) {}

  @Get('brands')
  async getBrands() {
    return this.fipeService.getBrands();
  }

  @Get('models')
  async getModels(@Query('brand') brandCode: string) {
    if (!brandCode) {
      throw new BadRequestException('Código da marca é obrigatório');
    }
    return this.fipeService.getModels(brandCode);
  }

  @Get('years')
  async getYears(
    @Query('brand') brandCode: string,
    @Query('model') modelCode: string,
  ) {
    if (!brandCode || !modelCode) {
      throw new BadRequestException('Código da marca e modelo são obrigatórios');
    }
    return this.fipeService.getYears(brandCode, modelCode);
  }

  @Get('value')
  async getValue(
    @Query('brand') brandCode: string,
    @Query('model') modelCode: string,
    @Query('year') yearCode: string,
    @Query('brandName') brandName?: string,
    @Query('modelName') modelName?: string,
  ) {
    if (!brandCode || !modelCode || !yearCode) {
      throw new BadRequestException('Todos os parâmetros são obrigatórios');
    }

    return this.fipeService.getValue(
      brandCode,
      modelCode,
      yearCode,
      brandName,
      modelName,
    );
  }
}
