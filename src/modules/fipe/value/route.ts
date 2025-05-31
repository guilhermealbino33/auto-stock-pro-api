import { type NextRequest, NextResponse } from "next/server"
import { getFipeValue, parseFipeValue } from "@/lib/fipe-api"
import { cacheFipeValue, getCachedFipeValue } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brandCode = searchParams.get("brand")
    const modelCode = searchParams.get("model")
    const yearCode = searchParams.get("year")
    const brandName = searchParams.get("brandName")
    const modelName = searchParams.get("modelName")

    if (!brandCode || !modelCode || !yearCode) {
      return NextResponse.json({ error: "Todos os parâmetros são obrigatórios" }, { status: 400 })
    }

    // Verificar cache primeiro
    if (brandName && modelName) {
      const year = Number.parseInt(yearCode)
      const cachedValue = await getCachedFipeValue(brandName, modelName, year)

      if (cachedValue) {
        return NextResponse.json({
          value: cachedValue,
          cached: true,
        })
      }
    }

    // Buscar na API FIPE
    const fipeData = await getFipeValue(brandCode, modelCode, yearCode)

    if (!fipeData) {
      return NextResponse.json({ error: "Valor não encontrado" }, { status: 404 })
    }

    const numericValue = parseFipeValue(fipeData.Valor)

    // Cachear o resultado
    if (brandName && modelName) {
      const year = Number.parseInt(yearCode)
      await cacheFipeValue(brandName, modelName, year, fipeData.CodigoFipe, numericValue, fipeData.MesReferencia)
    }

    return NextResponse.json({
      ...fipeData,
      numericValue,
      cached: false,
    })
  } catch (error) {
    console.error("Erro ao buscar valor:", error)
    return NextResponse.json({ error: "Erro ao buscar valor" }, { status: 500 })
  }
} 