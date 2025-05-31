import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Vehicle {
  id: string
  user_id: string
  brand: string
  model: string
  year: number
  color?: string
  mileage?: number
  purchase_price?: number
  sale_price?: number
  fipe_value?: number
  fipe_code?: string
  description?: string
  status: "available" | "reserved" | "sold"
  photos: string[] | string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  vehicle_id: string
  user_id: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  sale_price: number
  payment_method?: string
  profit?: number
  profit_percentage?: number
  sale_date: string
  notes?: string
}

// Veículos
export async function createVehicle(
  userId: string,
  vehicleData: Omit<Vehicle, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Vehicle> {
  let photos: string[] = [];
  
  // Processar o campo photos para garantir que é um array
  if (Array.isArray(vehicleData.photos)) {
    photos = vehicleData.photos;
  } else if (typeof vehicleData.photos === 'string') {
    try {
      if (vehicleData.photos.startsWith('[')) {
        const parsed = JSON.parse(vehicleData.photos);
        photos = Array.isArray(parsed) ? parsed : [parsed];
      } else if (vehicleData.photos) {
        photos = [vehicleData.photos];
      }
    } catch (e) {
      console.error("Erro ao processar photos em createVehicle:", e);
    }
  }
  
  console.log("createVehicle - photos processado:", photos);
  
  const result = await sql`
    INSERT INTO vehicles (
      user_id, brand, model, year, color, mileage, 
      purchase_price, sale_price, fipe_value, fipe_code, 
      description, status, photos
    )
    VALUES (
      ${userId}, ${vehicleData.brand}, ${vehicleData.model}, ${vehicleData.year},
      ${vehicleData.color}, ${vehicleData.mileage}, ${vehicleData.purchase_price},
      ${vehicleData.sale_price}, ${vehicleData.fipe_value}, ${vehicleData.fipe_code},
      ${vehicleData.description}, ${vehicleData.status}, ${photos}
    )
    RETURNING *
  `
  
  // Processar o resultado para garantir que photos é um array
  const vehicle = result[0];
  if (typeof vehicle.photos === 'string') {
    try {
      vehicle.photos = JSON.parse(vehicle.photos);
    } catch (e) {
      vehicle.photos = [];
    }
  }
  
  if (!Array.isArray(vehicle.photos)) {
    vehicle.photos = [];
  }
  
  return vehicle as Vehicle;
}

export async function getVehiclesByUser(userId: string): Promise<Vehicle[]> {
  const result = await sql`
    SELECT * FROM vehicles 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  
  // Garantir que todos os veículos tenham photos como array
  const vehicles = result.map(vehicle => {
    console.log(`Veículo ${vehicle.id} - ${vehicle.brand} ${vehicle.model} - photos antes:`, vehicle.photos)
    console.log(`Tipo de photos:`, typeof vehicle.photos)
    
    // Se photos é string, tenta converter para array
    if (typeof vehicle.photos === 'string') {
      try {
        // Se começa com '[', é provavelmente um array JSON
        if (vehicle.photos.startsWith('[')) {
          const parsedPhotos = JSON.parse(vehicle.photos);
          console.log(`Photos após parse:`, parsedPhotos);
          
          // Verificar se o resultado do parse é realmente um array
          if (Array.isArray(parsedPhotos)) {
            vehicle.photos = parsedPhotos;
          } else {
            // Se não for array, converter para array com um item
            vehicle.photos = [parsedPhotos];
          }
        } else if (vehicle.photos) {
          // Se for uma string única, transformar em array com um item
          vehicle.photos = [vehicle.photos];
        } else {
          // String vazia ou null
          vehicle.photos = [];
        }
      } catch (e) {
        console.error(`Erro ao converter photos para veículo ${vehicle.id}:`, e);
        console.error(`Conteúdo de photos que causou erro:`, vehicle.photos);
        // Se falhar, retorna um array vazio
        vehicle.photos = [];
      }
    }
    
    // Se não é um array, inicializa como array vazio
    if (!Array.isArray(vehicle.photos)) {
      vehicle.photos = [];
    }
    
    console.log(`Veículo ${vehicle.id} - photos depois:`, vehicle.photos);
    console.log(`Quantidade de fotos:`, vehicle.photos.length);
    
    return vehicle;
  });
  
  return vehicles as Vehicle[];
}

export async function updateVehicleStatus(vehicleId: string, status: Vehicle["status"]): Promise<void> {
  await sql`
    UPDATE vehicles 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${vehicleId}
  `
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  await sql`DELETE FROM vehicles WHERE id = ${vehicleId}`
}

import { Express } from 'express';

export async function saveVehicleImage(vehicleId: string, file: Express.Multer.File): Promise<void> {
  // Primeiro vamos obter as fotos atuais
  const vehicle = await sql`
    SELECT photos FROM vehicles WHERE id = ${vehicleId}
  `
  
  if (!vehicle || !vehicle[0]) {
    throw new Error("Veículo não encontrado")
  }
  
  // Processar o array de fotos
  let photos: string[] = []
  
  if (typeof vehicle[0].photos === 'string') {
    try {
      // Tentar fazer parse se for uma string JSON
      if (vehicle[0].photos.startsWith('[')) {
        photos = JSON.parse(vehicle[0].photos)
      } else if (vehicle[0].photos) {
        photos = [vehicle[0].photos]
      } else {
        photos = []
      }
    } catch (e) {
      console.error('Erro ao converter photos:', e)
      photos = []
    }
  } else if (Array.isArray(vehicle[0].photos)) {
    photos = vehicle[0].photos
  }
  
  // A URL da imagem será o caminho relativo do arquivo
  const imageUrl = `/uploads/vehicles/${file.filename}`
  photos.push(imageUrl)
  
  // Garantir que o array é único (remover duplicatas)
  photos = [...new Set(photos)]
  
  // Atualizar o veículo com o array de fotos
  await sql`
    UPDATE vehicles 
    SET photos = ${photos}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${vehicleId}
  `
}

// Vendas
export async function createSale(saleData: Omit<Sale, "id" | "sale_date">): Promise<Sale> {
  const result = await sql`
    INSERT INTO sales (
      vehicle_id, user_id, customer_name, customer_email, customer_phone,
      sale_price, payment_method, profit, profit_percentage, notes
    )
    VALUES (
      ${saleData.vehicle_id}, ${saleData.user_id}, ${saleData.customer_name},
      ${saleData.customer_email}, ${saleData.customer_phone}, ${saleData.sale_price},
      ${saleData.payment_method}, ${saleData.profit}, ${saleData.profit_percentage},
      ${saleData.notes}
    )
    RETURNING *
  `
  return result[0] as Sale
}

export async function getSalesByUser(userId: string): Promise<Sale[]> {
  const result = await sql`
    SELECT s.*, v.brand, v.model, v.year
    FROM sales s
    JOIN vehicles v ON s.vehicle_id = v.id
    WHERE s.user_id = ${userId}
    ORDER BY s.sale_date DESC
  `
  return result as Sale[]
}

// Cache FIPE
export async function cacheFipeValue(
  brand: string,
  model: string,
  year: number,
  fipeCode: string,
  value: number,
  monthReference: string,
): Promise<void> {
  await sql`
    INSERT INTO fipe_cache (brand, model, year, fipe_code, value, month_reference)
    VALUES (${brand}, ${model}, ${year}, ${fipeCode}, ${value}, ${monthReference})
    ON CONFLICT (fipe_code, month_reference) 
    DO UPDATE SET value = ${value}, cached_at = CURRENT_TIMESTAMP
  `
}

export async function getCachedFipeValue(brand: string, model: string, year: number): Promise<number | null> {
  const result = await sql`
    SELECT value FROM fipe_cache
    WHERE brand = ${brand} AND model = ${model} AND year = ${year}
    AND cached_at > NOW() - INTERVAL '7 days'
    ORDER BY cached_at DESC
    LIMIT 1
  `
  return result.length > 0 ? result[0].value : null
}

export async function getVehicleById(vehicleId: string, userId: string): Promise<Vehicle | null> {
  const result = await sql`
    SELECT * FROM vehicles 
    WHERE id = ${vehicleId} AND user_id = ${userId}
  `
  
  if (result.length === 0) {
    return null
  }
  
  const vehicle = result[0]
  
  // Processar as fotos para garantir que sejam um array
  if (typeof vehicle.photos === 'string') {
    try {
      if (vehicle.photos.startsWith('[')) {
        vehicle.photos = JSON.parse(vehicle.photos)
      } else if (vehicle.photos) {
        vehicle.photos = [vehicle.photos]
      } else {
        vehicle.photos = []
      }
    } catch (e) {
      console.error('Erro ao converter photos no getVehicleById:', e)
      vehicle.photos = []
    }
  }
  
  // Se não é um array, inicializar como vazio
  if (!Array.isArray(vehicle.photos)) {
    vehicle.photos = []
  }
  
  return vehicle as Vehicle
}

export async function updateVehicle(vehicleId: string, userId: string, vehicleData: Partial<Omit<Vehicle, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Vehicle> {
  const result = await sql`
    UPDATE vehicles SET
      brand = ${vehicleData.brand},
      model = ${vehicleData.model},
      year = ${vehicleData.year},
      color = ${vehicleData.color},
      mileage = ${vehicleData.mileage},
      purchase_price = ${vehicleData.purchase_price},
      sale_price = ${vehicleData.sale_price},
      fipe_value = ${vehicleData.fipe_value},
      fipe_code = ${vehicleData.fipe_code},
      description = ${vehicleData.description},
      status = ${vehicleData.status},
      photos = ${vehicleData.photos},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${vehicleId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0] as Vehicle
}

export async function getAllVehicles(limit = 20, offset = 0): Promise<Vehicle[]> {
  const result = await sql`
    SELECT * FROM vehicles ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `
  // Garantir que todos os veículos tenham photos como array
  const vehicles = result.map(vehicle => {
    if (typeof vehicle.photos === 'string') {
      try {
        if (vehicle.photos.startsWith('[')) {
          vehicle.photos = JSON.parse(vehicle.photos)
        } else if (vehicle.photos) {
          vehicle.photos = [vehicle.photos]
        } else {
          vehicle.photos = []
        }
      } catch (e) {
        vehicle.photos = []
      }
    }
    if (!Array.isArray(vehicle.photos)) {
      vehicle.photos = []
    }
    return vehicle
  })
  return vehicles as Vehicle[]
}
