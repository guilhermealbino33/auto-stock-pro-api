import { Injectable } from '@nestjs/common';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  Vehicle,
} from '@/lib/database';

@Injectable()
export class VehiclesService {
  async getAllVehicles(limit: number, offset: number) {
    const vehicles = await getAllVehicles(limit, offset);

    return vehicles.map((vehicle) => {
      if (!Array.isArray(vehicle.photos)) {
        if (typeof vehicle.photos === 'string') {
          try {
            vehicle.photos = vehicle.photos.startsWith('[')
              ? JSON.parse(vehicle.photos)
              : vehicle.photos
                ? [vehicle.photos]
                : [];
          } catch {
            vehicle.photos = [];
          }
        } else {
          vehicle.photos = [];
        }
      }
      return vehicle;
    });
  }

  async createVehicle(userId: string, data: any) {
    return createVehicle(userId, data);
  }

  async getVehicleById(vehicleId: string, userId: string) {
    return getVehicleById(vehicleId, userId);
  }

  async updateVehicle(vehicleId: string, userId: string, data: any) {
    return updateVehicle(vehicleId, userId, data);
  }

  async updateVehicleStatus(vehicleId: string, status: Vehicle['status']) {
    return updateVehicleStatus(vehicleId, status);
  }
}
