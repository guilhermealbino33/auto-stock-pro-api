import { type NextRequest, NextResponse } from "next/server"
import { getFipeModels } from "@/lib/fipe-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandCode = searchParams.get("brand")

    if (!brandCode) {
      return NextResponse.json({ error: "Código da marca é obrigatório" }, { status: 400 })
    }

    const models = await getFipeModels(brandCode)
    return NextResponse.json(models)
  } catch (error) {
    console.error("Erro ao buscar modelos:", error)
    return NextResponse.json({ error: "Erro ao buscar modelos" }, { status: 500 })
  }
} 