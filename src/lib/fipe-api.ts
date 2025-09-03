/**
 * @todo
 *
 * mover tudo para o FIPE MODULE
 */

export interface FipeBrand {
  codigo: string;
  nome: string;
}

export interface FipeModel {
  codigo: number;
  nome: string;
}

export interface FipeYear {
  codigo: string;
  nome: string;
}

export interface FipeValue {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

export async function getFipeBrands(): Promise<FipeBrand[]> {
  try {
    const response = await fetch(`${FIPE_BASE_URL}/carros/marcas`);
    if (!response.ok) throw new Error('Erro ao buscar marcas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar marcas FIPE:', error);
    return [];
  }
}

export async function getFipeModels(brandCode: string): Promise<FipeModel[]> {
  try {
    const response = await fetch(
      `${FIPE_BASE_URL}/carros/marcas/${brandCode}/modelos`
    );
    if (!response.ok) throw new Error('Erro ao buscar modelos');
    const data = await response.json();
    return data.modelos || [];
  } catch (error) {
    console.error('Erro ao buscar modelos FIPE:', error);
    return [];
  }
}

export async function getFipeYears(
  brandCode: string,
  modelCode: string
): Promise<FipeYear[]> {
  try {
    const response = await fetch(
      `${FIPE_BASE_URL}/carros/marcas/${brandCode}/modelos/${modelCode}/anos`
    );
    if (!response.ok) throw new Error('Erro ao buscar anos');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar anos FIPE:', error);
    return [];
  }
}

export async function getFipeValue(
  brandCode: string,
  modelCode: string,
  yearCode: string
): Promise<FipeValue | null> {
  try {
    const response = await fetch(
      `${FIPE_BASE_URL}/carros/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`
    );
    if (!response.ok) throw new Error('Erro ao buscar valor');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar valor FIPE:', error);
    return null;
  }
}

export function parseFipeValue(value: string): number {
  return Number.parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.'));
}
