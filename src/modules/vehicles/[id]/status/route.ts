import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { updateVehicleStatus } from "@/lib/database"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const vehicleId = params.id
    const { status } = await request.json()

    if (!vehicleId || !status) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    if (!["available", "reserved", "sold"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    await updateVehicleStatus(vehicleId, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar status do veículo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 