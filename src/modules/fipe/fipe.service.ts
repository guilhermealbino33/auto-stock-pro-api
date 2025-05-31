import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  getFipeBrands,
  getFipeModels,
  getFipeYears,
  getFipeValue,
  parseFipeValue,
} from '@/lib/fipe-api';
import { cacheFipeValue, getCachedFipeValue } from '@/lib/database';

@Injectable()
export class FipeService {
  async getBrands() {
    try {
      return await getFipeBrands();
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      throw new InternalServerErrorException('Erro ao buscar marcas');
    }
  }

  async getModels(brandCode: string) {
    try {
      return await getFipeModels(brandCode);
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      throw new InternalServerErrorException('Erro ao buscar modelos');
    }
  }

  async getYears(brandCode: string, modelCode: string) {
    try {
      return await getFipeYears(brandCode, modelCode);
    } catch (error) {
      console.error('Erro ao buscar anos:', error);
      throw new InternalServerErrorException('Erro ao buscar anos');
    }
  }

  async getValue(
    brandCode: string,
    modelCode: string,
    yearCode: string,
    brandName?: string,
    modelName?: string
  ) {
    try {
      const year = Number.parseInt(yearCode);

      // 1. Check cache
      if (brandName && modelName) {
        const cachedValue = await getCachedFipeValue(
          brandName,
          modelName,
          year
        );
        if (cachedValue) {
          return { value: cachedValue, cached: true };
        }
      }

      // 2. Fetch from API
      const fipeData = await getFipeValue(brandCode, modelCode, yearCode);
      if (!fipeData) {
        throw new NotFoundException('Valor não encontrado');
      }

      const numericValue = parseFipeValue(fipeData.Valor);

      // 3. Cache the result
      if (brandName && modelName) {
        await cacheFipeValue(
          brandName,
          modelName,
          year,
          fipeData.CodigoFipe,
          numericValue,
          fipeData.MesReferencia
        );
      }

      return {
        ...fipeData,
        numericValue,
        cached: false,
      };
    } catch (error) {
      console.error('Erro ao buscar valor:', error);
      throw new InternalServerErrorException('Erro ao buscar valor');
    }
  }
}
