import { neon } from "@neondatabase/serverless"
import jwt from 'jsonwebtoken'

// Verificar se a variável de ambiente existe
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida")
}

const sql = neon(process.env.DATABASE_URL)

// Modelo básico de usuário
export type User = {
  id: string
  email: string
  name?: string
  role: string
}

/**
 * Função para criar hash de senha
 * @param password Senha em texto plano
 * @returns Hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    console.log("Importando bcrypt...")
    const bcrypt = await import("bcryptjs")
    console.log("bcrypt importado com sucesso")
    
    console.log("Fazendo hash da senha...")
    const hash = await bcrypt.hash(password, 12)
    console.log("Hash criado com sucesso")
    
    return hash
  } catch (error) {
    console.error("Erro ao fazer hash da senha:", error)
    throw error
  }
}

/**
 * Função para verificar senha
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs")
    return bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Erro ao verificar senha:", error)
    throw error
  }
}

/**
 * Função para buscar usuário por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, name, password_hash, role 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `
    
    if (result.length === 0) {
      return null
    }
    
    return {
      id: result[0].id,
      email: result[0].email,
      name: result[0].name,
      role: result[0].role
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }
}

/**
 * Função para registrar novo usuário
 */
export async function registerUser(email: string, password: string, name: string): Promise<User | null> {
  try {
    // Verificar se o usuário já existe
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw new Error("Usuário já existe")
    }
    
    // Hash da senha
    const hashedPassword = await hashPassword(password)
    
    // Criar usuário no banco
    const result = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${hashedPassword}, ${name}, 'user')
      RETURNING id, email, name, role
    `
    
    if (result.length === 0) {
      return null
    }
    
    return {
      id: result[0].id,
      email: result[0].email,
      name: result[0].name,
      role: result[0].role
    }
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    throw error
  }
}

/**
 * Função para gerar token JWT
 */
export async function generateToken(user: User): Promise<string> {
  try {
    const secret = process.env.JWT_SECRET || "test-jwt-secret"
    
    console.log(`Gerando token para usuário: ${user.email}`)
    
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: "7d",
      }
    )
    
    console.log("Token gerado com sucesso")
    
    return token
  } catch (error) {
    console.error("Erro ao gerar token:", error)
    throw error
  }
}

/**
 * Função para verificar token JWT
 */
export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  const secret = process.env.JWT_SECRET || "test-jwt-secret"
  
  try {
    return jwt.verify(token, secret) as { userId: string; email: string }
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return null
  }
}

/**
 * Função para verificar se o usuário está autenticado
 */
export async function isAuthenticated(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token)
    if (!payload) {
      return false
    }
    
    const user = await getUserByEmail(payload.email)
    return !!user
  } catch (error) {
    return false
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // Buscar usuário pelo e-mail, incluindo o hash da senha
    const result = await sql`
      SELECT id, email, name, password_hash, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0]
    // Verificar a senha
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      return null
    }

    // Retornar usuário sem o campo password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error)
    return null
  }
}

export { registerUser as createUser }
