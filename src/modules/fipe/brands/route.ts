import { NextResponse } from "next/server"
import { getFipeBrands } from "@/lib/fipe-api"

export async function GET() {
  try {
    const brands = await getFipeBrands()
    return NextResponse.json(brands)
  } catch (error) {
    console.error("Erro ao buscar marcas:", error)
    return NextResponse.json({ error: "Erro ao buscar marcas" }, { status: 500 })
  }
}
