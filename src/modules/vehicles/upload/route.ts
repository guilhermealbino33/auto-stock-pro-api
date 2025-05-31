import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { saveVehicleImage } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import { existsSync } from "fs"

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

    const formData = await request.formData()
    const vehicleId = formData.get("vehicleId") as string
    const file = formData.get("file") as File

    if (!vehicleId || !file) {
      return NextResponse.json({ error: "Faltam dados obrigatórios" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Gerar nome único para o arquivo
    const uniqueFilename = `${randomUUID()}-${file.name}`
    const uploadsDir = join(process.cwd(), "public", "uploads")
    const path = join(uploadsDir, uniqueFilename)
    
    // Garantir que a pasta de uploads existe
    if (!existsSync(uploadsDir)) {
      console.log("Criando diretório de uploads...");
      await mkdir(uploadsDir, { recursive: true });
    }

    console.log("[UPLOAD API] vehicleId:", vehicleId)
    console.log("[UPLOAD API] file:", file)
    if (file) {
      console.log("[UPLOAD API] file.name:", file.name)
      console.log("[UPLOAD API] file.type:", file.type)
      console.log("[UPLOAD API] file.size:", file.size)
    }

    // Salvar o arquivo
    await writeFile(path, buffer)
    console.log("[UPLOAD API] Arquivo salvo em:", path)

    // Salvar referência no banco de dados (garantir que o caminho comece com /)
    const imageUrl = `/uploads/${uniqueFilename}`
    console.log("Upload de imagem - Caminho salvo:", imageUrl)
    await saveVehicleImage(vehicleId, imageUrl)
    console.log("[UPLOAD API] saveVehicleImage executado com:", vehicleId, imageUrl)

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    })
  } catch (error) {
    console.error("Erro ao fazer upload de imagem:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 