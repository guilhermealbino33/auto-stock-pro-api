import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { FipeService } from './fipe.service';
import { GetModelsDTO, GetValueDTO, GetYearsDTO } from './dto';


@Controller('fipe')
export class FipeController {
  constructor(private readonly fipeService: FipeService) {}

  @Get('brands')
  async getBrands() {
    return this.fipeService.getBrands();
  }

  @Get('models')
  async getModels(@Query() query: GetModelsDTO) {
    return this.fipeService.getModels(query.brand);
  }

  @Get('years')
  async getYears(@Query() query: GetYearsDTO) {
    return this.fipeService.getYears(query.brand, query.model);
  }

  @Get('value')
  async getValue(@Query() query: GetValueDTO) {
    const { brand, model, year, brandName, modelName } = query;
    return this.fipeService.getValue(brand, model, year, brandName, modelName);
  }
}
