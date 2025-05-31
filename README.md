# AutoStockPro API

Backend da aplicação AutoStockPro para gestão de estoque de veículos.

## 🚀 Tecnologias

- NestJS 10
- PostgreSQL
- TypeORM
- JWT
- Swagger
- Zod

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
├── config/         # Configurações
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
- Rate limiting para APIs externas

## 📈 Deploy

O projeto está pronto para deploy em qualquer ambiente Node.js.

## 📝 Licença

MIT
