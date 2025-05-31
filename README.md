# AutoStockPro API

Backend da aplicação AutoStockPro para gestão de estoque de veículos.

## 🚀 Tecnologias

- NestJS 10
- PostgreSQL (Neon Database)
- TypeORM
- JWT
- Swagger
- Zod
- Multer (upload de arquivos)
- Neon Database Serverless

## 🛠️ Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

O arquivo .env deve conter:
```
DATABASE_URL=sua_url_do_banco_neon
JWT_SECRET=seu_segredo_jwt
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Inicie o servidor em modo de desenvolvimento:
```bash
npm run start:dev
```

## 📁 Estrutura do Projeto

```
src/
├── modules/         # Módulos da aplicação
│   ├── auth/       # Autenticação
│   ├── fipe/       # Integração FIPE
│   └── vehicles/   # Gestão de veículos
│       ├── dto/    # DTOs do módulo
│       ├── service/ # Serviços do módulo
│       └── controller/ # Controllers do módulo
├── lib/            # Bibliotecas compartilhadas
│   ├── auth.ts     # Funções de autenticação
│   └── database.ts # Configuração do banco
└── common/         # Utilitários comuns
```

## 🚗 Módulo de Veículos

O módulo de veículos oferece endpoints para gestão completa do estoque:

### Endpoints Disponíveis

- **POST /vehicles** - Criar novo veículo
  - Requer autenticação
  - Corpo: dados do veículo

- **GET /vehicles/:id** - Buscar veículo por ID
  - Requer autenticação
  - Parâmetros: `id` do veículo

- **PUT /vehicles/:id** - Atualizar veículo
  - Requer autenticação
  - Parâmetros: `id` do veículo
  - Corpo: dados atualizados do veículo

- **PUT /vehicles/:id/status** - Atualizar status do veículo
  - Requer autenticação
  - Parâmetros: `id` do veículo
  - Corpo: `status` (valores válidos: 'available', 'reserved', 'sold')

### Upload de Imagens

O módulo suporta upload de imagens através do Multer:
- Configurado para salvar em `./uploads`
- Suporte a múltiplos arquivos
- Validação de tipos de arquivo permitidos

### Autenticação

Todos os endpoints do módulo de veículos requerem autenticação através do AuthGuard, que:
- Verifica token JWT no header Authorization
- Valida o token
- Adiciona informações do usuário na requisição (`req.user`)
- Permite acesso apenas a veículos do usuário logado

## 🔐 Autenticação

- JWT para autenticação
- BCrypt para hashing de senhas
- Passport para autenticação
- Rate limiting para APIs externas

### Endpoints de Autenticação

- **POST /auth/login** - Login de usuário
- **POST /auth/register** - Registro de novo usuário
- **POST /auth/forgot-password** - Recuperação de senha
- **GET /auth/verify** - Verificação de token

## 📈 Deploy

O projeto está pronto para deploy em qualquer ambiente Node.js.

## 📝 Licença

MIT
