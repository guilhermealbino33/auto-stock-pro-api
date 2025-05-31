import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== INÍCIO DO REGISTRO ===")

    // Verificar variáveis de ambiente
    console.log("DATABASE_URL existe:", !!process.env.DATABASE_URL)
    console.log("JWT_SECRET existe:", !!process.env.JWT_SECRET)

    const body = await request.json()
    console.log("Body recebido:", { email: body.email, name: body.name })

    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Testar conexão com banco primeiro
    console.log("Testando conexão com banco...")
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL!)

    // Teste simples de conexão
    const testResult = await sql`SELECT 1 as test`
    console.log("Conexão com banco OK:", testResult)

    // Importar funções de auth
    console.log("Importando funções de auth...")
    const { createUser, generateToken } = await import("@/lib/auth")

    console.log("Criando usuário...")
    const user = await createUser(email, password, name)

    console.log("Gerando token...")
    const token = generateToken(user)

    console.log("Usuário criado com sucesso:", user.email)

    return NextResponse.json({
      user,
      token,
    })
  } catch (error: any) {
    console.error("=== ERRO DETALHADO ===")
    console.error("Tipo do erro:", typeof error)
    console.error("Mensagem:", error.message)
    console.error("Stack:", error.stack)
    console.error("Erro completo:", error)

    if (error.message === "Este email já está em uso") {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error.message,
        type: typeof error,
      },
      { status: 500 },
    )
  }
}
