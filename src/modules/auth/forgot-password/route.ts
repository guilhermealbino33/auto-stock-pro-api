import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    // Verificar se o usuário existe
    const result = await sql`
      SELECT id, email, name FROM users WHERE email = ${email}
    `

    if (result.length === 0) {
      // Por segurança, não revelamos se o email existe ou não
      return NextResponse.json({
        message: "Se o email estiver cadastrado, você receberá as instruções de recuperação.",
      })
    }

    // Aqui você implementaria o envio real do email
    // Por enquanto, apenas simulamos o sucesso
    console.log(`Email de recuperação seria enviado para: ${email}`)

    return NextResponse.json({
      message: "Se o email estiver cadastrado, você receberá as instruções de recuperação.",
    })
  } catch (error) {
    console.error("Erro ao processar recuperação de senha:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
