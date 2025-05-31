import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { createVehicle, getVehiclesByUser, getAllVehicles } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Paginação
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    // Buscar apenas uma página de veículos
    const vehicles = await getAllVehicles(limit, offset)
    console.log("[API/vehicles] Estoque total de veículos:", vehicles.length)
    // Garantir que as fotos estejam no formato correto antes de enviar
    const processedVehicles = vehicles.map(vehicle => {
      if (!Array.isArray(vehicle.photos)) {
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
        } else {
          vehicle.photos = []
        }
      }
      return vehicle
    })
    return NextResponse.json(processedVehicles)
  } catch (error) {
    console.error("Erro ao buscar veículos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const vehicleData = await request.json()
    const vehicle = await createVehicle(decoded.userId, vehicleData)

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Erro ao criar veículo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 