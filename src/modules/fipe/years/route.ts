import { type NextRequest, NextResponse } from "next/server"
import { getFipeYears } from "@/lib/fipe-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandCode = searchParams.get("brand")
    const modelCode = searchParams.get("model")

    if (!brandCode || !modelCode) {
      return NextResponse.json({ error: "Código da marca e modelo são obrigatórios" }, { status: 400 })
    }

    const years = await getFipeYears(brandCode, modelCode)
    return NextResponse.json(years)
  } catch (error) {
    console.error("Erro ao buscar anos:", error)
    return NextResponse.json({ error: "Erro ao buscar anos" }, { status: 500 })
  }
}
