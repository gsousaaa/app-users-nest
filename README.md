# 🧠 API de Usuários - NestJS + PostgreSQL

---

## 🚀 Tecnologias utilizadas

- **[NestJS](https://nestjs.com/)** — framework moderno baseado em Node.js e TypeScript
- **[TypeORM](https://typeorm.io/)** — ORM com integração nativa ao NestJS
- **[JWT](https://jwt.io/)** — autenticação via tokens seguros
- **[Docker + Docker Compose](https://docs.docker.com/compose/)** — ambiente isolado e padronizado para execução do projeto

---

## 🧠 Decisões de Arquitetura

### ✅ NestJS
Escolhido por sua estrutura modular, suporte ao TypeScript nativo, injeção de dependências e integração perfeita com bibliotecas como `class-validator` e `TypeORM`

### ✅ TypeORM
Utilizado por oferecer **suporte nativo ao NestJS**, além de permitir:
- Mapeamento direto entre entidades e tabelas;
- Repositórios prontos para uso;
- QueryBuilder poderoso para consultas complexas.

### ✅ PostgreSQL
Escolhido por ser:
- Open source;
- Muito bem suportado pelo TypeORM.

### ✅ class-validator
Utilizado para validação dos dados recebidos nos DTOs, auxiliando também na proteção contra SQL Injection:
- Validações como `@IsEmail`, `@IsNotEmpty`, `@IsStrongPassword`;
- Possibilidade de mensagens personalizadas;
- Integra-se nativamente com o `ValidationPipe` do NestJS.

### ✅ Docker Compose
Facilita o desenvolvimento e a padronização do ambiente com:
- Serviços isolados (ex: banco de dados `db`);
- Configuração rápida

---

## ⚙️ Configuração do ambiente

1. Clone o repositório:

```bash
git clone https://github.com/gsousaa/app-users.git
cd seu-projeto
```

2. Crie um arquivo `.env`:

```env.example
# Banco de dados
PG_HOST=db
PG_PORT=5432
PG_USERNAME=test
PG_PASSWORD=test123
PG_DATABASE=test_db

# JWT
JWT_SECRET_KEY="jwtscrt"

# Servidor
PORT=3333
NODE_ENV=dev
```

3. Suba os containers com Docker Compose:

```bash
docker-compose up --build
```

---

## 📡 Rotas da API

### 🔐 Auth (`/auth`)

| Método | Rota             | Descrição                         | Autenticação |
|--------|------------------|------------------------------------|--------------|
| POST   | `/auth/login`    | Login com e-mail e senha           | ❌           |
| POST   | `/auth/register` | Criação de novo usuário            | ❌           |

### 👤 Users (`/users`)

| Método | Rota                         | Descrição                                    | Acesso |
|--------|------------------------------|----------------------------------------------|--------|
| GET    | `/users`                     | Lista todos os usuários com filtros          | Admin  |
| PATCH  | `/users/:id`                 | Atualiza dados de um usuário                 | User/Admin |
| DELETE | `/users/:id`                 | Deleta um usuário (exceto a si mesmo)        | Admin  |
| PATCH  | `/users/password-reset`      | Altera a senha do usuário autenticado        | User |
| GET    | `/users/inactive`            | Lista usuários inativos há 30+ dias          | Admin  |

---

## 🔐 Controle de Acesso

- Usuários **comuns** só podem alterar seus próprios dados (e não podem mudar o cargo).
- Apenas **administradores** podem:
  - Listar todos os usuários;
  - Deletar usuários;
  - Ver usuários inativos.

---

## 🧪 Validações

As validações são feitas usando `class-validator` nos DTOs. Exemplo:

```ts
export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string

  @IsStrongPassword({}, { message: 'Senha fraca: mínimo de 8 caracteres com letras, números e símbolos' })
  password: string

  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string
}
```

---

## 🐳 Rodando com Docker

```bash
docker-compose up
```

A aplicação estará acessível em:  
📍 **http://localhost:3333**

---

## 📦 Scripts

```bash
# Instalar dependências
npm install

# Rodar localmente sem docker
npm run start:dev

# Testes (se aplicável)
npm run test
```

---
