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

## 🔐 Autenticação

- JWT para autenticação
- BCrypt para hashing de senhas
- Rate limiting para APIs externas

## 📈 Deploy

O projeto está pronto para deploy em qualquer ambiente Node.js.

## 📝 Licença

MIT
