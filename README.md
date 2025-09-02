# 🚗 AutoStockPro API

API RESTful para gestão de estoque de veículos, desenvolvida com NestJS. Oferece recursos completos para cadastro, gerenciamento e busca de veículos, além de sistema de autenticação seguro.

## 🚀 Tecnologias

- **Backend:** NestJS 10
- **Banco de Dados:** PostgreSQL (Neon Database)
- **ORM:** TypeORM
- **Autenticação:** JWT, Passport
- **Documentação:** Swagger
- **Validação:** Zod
- **Upload de Arquivos:** Multer
- **Hashing:** Bcrypt
- **Testes:** Jest

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Neon Database](https://neon.tech/) (ou PostgreSQL local)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/auto-stock-pro-api.git
   cd auto-stock-pro-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

4. Edite o arquivo `.env` com suas configurações:
   ```env
   # Configurações do Banco de Dados
   DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
   
   # Autenticação
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRES_IN=1d
   
   # Aplicação
   PORT=3000
   NODE_ENV=development
   
   # CORS
   CORS_ORIGIN=http://localhost:3001
   
   # Upload
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5MB
   ```

### Comandos Úteis

```bash
# Iniciar em modo desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Iniciar em produção
npm run start:prod

# Rodar migrações
npm run typeorm migration:run

# Testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov
```

## 📚 Documentação da API

A documentação interativa da API está disponível em:
- Swagger UI: `http://localhost:3000/api`
- JSON: `http://localhost:3000/api-json`

## 🚀 Endpoints Principais

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Atualizar token de acesso
- `POST /auth/forgot-password` - Solicitar recuperação de senha
- `POST /auth/reset-password` - Redefinir senha

### Veículos

- `GET /vehicles` - Listar veículos (com filtros e paginação)
- `POST /vehicles` - Criar novo veículo
- `GET /vehicles/:id` - Buscar veículo por ID
- `PUT /vehicles/:id` - Atualizar veículo
- `DELETE /vehicles/:id` - Remover veículo
- `POST /vehicles/:id/images` - Adicionar imagens ao veículo

### Vendas

- `GET /sales` - Listar todas as vendas
- `GET /sales/report` - Gerar relatório de vendas
- `GET /sales/:id` - Buscar venda por ID
- `POST /sales` - Criar nova venda
  - Corpo: dados da venda (incluindo ID do veículo e do cliente)
- `PATCH /sales/:id` - Atualizar venda
  - Parâmetros: `id` da venda
  - Corpo: dados atualizados da venda
- `DELETE /sales/:id` - Remover venda
  - Parâmetros: `id` da venda

### FIPE

- `GET /fipe/brands` - Listar marcas
- `GET /fipe/models/:brandId` - Listar modelos por marca
- `GET /fipe/years/:brandId/:modelId` - Listar anos por modelo
- `GET /fipe/vehicle/:brandId/:modelId/:yearId` - Buscar informações do veículo

## 🛡️ Segurança

- Autenticação JWT com refresh tokens
- Rate limiting para prevenir abuso
- Validação de entrada com Zod
- CORS configurado
- Headers de segurança (helmet)
- Sanitização de dados

## 📦 Estrutura do Projeto

```
src/
├── common/            # Utilitários e decorators compartilhados
│   ├── decorators/    # Decorators personalizados
│   ├── filters/       # Filtros de exceção
│   ├── guards/        # Guards de autenticação/autorização
│   ├── interceptors/  # Interceptores
│   └── pipes/         # Pipes de validação
│
├── config/            # Configurações da aplicação
│   ├── app.config.ts  # Configurações gerais
│   └── typeorm/       # Configurações do TypeORM
│
├── modules/           # Módulos da aplicação
│   ├── auth/          # Autenticação e autorização
│   ├── users/         # Gerenciamento de usuários
│   ├── vehicles/      # Gestão de veículos
│   └── fipe/          # Integração com Tabela FIPE
│
├── lib/               # Bibliotecas e serviços compartilhados
│   ├── storage/       # Gerenciamento de arquivos
│   └── http/          # Clientes HTTP
│
└── main.ts            # Ponto de entrada da aplicação
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

