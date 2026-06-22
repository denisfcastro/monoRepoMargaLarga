# 🐴 Monorepo Manga Larga — Clínica Equina

Sistema de gestão para clínica equina de fisioterapia, com cadastro de cavalos e sessões de fisioterapia.

## 👥 Integrantes

<!-- ⚠️ PREENCHER com os nomes reais dos integrantes -->
| Nome | Responsabilidade |
|------|-----------------|
| Integrante 1 | Backend (NestJS) — Módulos Auth, Users |
| Integrante 2 | Backend (NestJS) — Módulos Cavalo, SessãoFisio |
| Integrante 3 | Frontend (Angular 20) — Telas de CRUD e Login |
| Integrante 4 | Configuração do Monorepo, Documentação e Testes |

**Tema da 1VA:** Clínica Equina — gestão de cavalos e sessões de fisioterapia com regras de negócio.

---

## 🏗 Estrutura do Projeto

```text
monoRepoMangaLarga/
├── apps/
│   ├── backend/           # NestJS 11 + TypeORM + SQLite
│   └── frontend/          # Angular 20 Standalone + Tailwind CSS 4
├── packages/
│   ├── utils/             # Tipos e utilitários compartilhados
│   ├── typescript-config/ # tsconfig base compartilhado
│   └── eslint-config/     # ESLint compartilhado
├── .env.example           # Variáveis de ambiente documentadas
├── turbo.json             # Pipeline do Turborepo
├── pnpm-workspace.yaml    # Workspaces do pnpm
└── package.json           # Scripts globais
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18+ (recomendado v20+)
- [pnpm](https://pnpm.io/) v9+

---

## 🚀 Configuração e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/denisfcastro/monoRepoMargaLarga.git
cd monoRepoMargaLarga
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` da raiz para `apps/backend/.env`:

```bash
cp .env.example apps/backend/.env
```

O arquivo já vem com valores padrão para desenvolvimento local. Veja o conteúdo:

| Variável | Descrição | Valor padrão |
|----------|-----------|-------------|
| `PORT` | Porta do servidor NestJS | `3000` |
| `JWT_SECRET` | Segredo para assinar tokens JWT | `your-super-secret-jwt-key-change-in-production` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `60m` |
| `ADMIN_EMAIL` | E-mail do admin pré-cadastrado | `admin@mangalarga.com` |
| `ADMIN_PASSWORD` | Senha do admin pré-cadastrado | `Admin@1234` |
| `ADMIN_NOME` | Nome do admin pré-cadastrado | `Administrador` |

### 3. Instalar dependências

```bash
pnpm install
```

### 4. Iniciar em modo de desenvolvimento

```bash
pnpm dev
```

Isso sobe simultaneamente:
- **Backend** em `http://localhost:3000`
- **Frontend** em `http://localhost:4200`

### 5. Login com o administrador

Acesse `http://localhost:4200` e faça login com:

| Campo | Valor |
|-------|-------|
| E-mail | `admin@mangalarga.com` |
| Senha | `Admin@1234` |

> O usuário administrador é criado automaticamente pelo seed na primeira execução do backend.

---

## 📡 Endpoints da API

A documentação Swagger completa está disponível em: `http://localhost:3000/api/docs`

### Autenticação (`/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `POST` | `/auth/register` | Cadastrar novo usuário | Não |
| `POST` | `/auth/login` | Realizar login e obter token JWT | Não |

**Exemplo — Login:**
```json
POST /auth/login
Content-Type: application/json

{
  "email": "admin@mangalarga.com",
  "senha": "Admin@1234"
}

// Resposta:
{ "access_token": "eyJhbGciOiJIUzI1NiIs..." }
```

**Exemplo — Register:**
```json
POST /auth/register
Content-Type: application/json

{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "senhaSegura123"
}

// Resposta:
{ "message": "Cadastro realizado com sucesso! Sua conta está aguardando liberação pelo administrador." }
```

---

### Cavalos (`/cavalos`) — 🔒 Requer JWT

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/cavalos` | Listar todos os cavalos |
| `GET` | `/cavalos/:id` | Buscar cavalo por ID (com sessões) |
| `POST` | `/cavalos` | Criar um novo cavalo |
| `PATCH` | `/cavalos/:id` | Atualizar dados de um cavalo |
| `DELETE` | `/cavalos/:id` | Remover um cavalo |

**Exemplo — Criar cavalo:**
```json
POST /cavalos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Pé de Pano",
  "nomeHaras": "Haras Eldorado",
  "dataAquisicao": "2023-05-10",
  "emTratamento": true,
  "valorCompra": 15000
}
```

**Regras de negócio:**
- `dataAquisicao` não pode ser uma data futura
- `valorCompra` deve ser maior que 0
- Não é permitido cadastrar cavalo com mesmo nome no mesmo haras

---

### Sessões de Fisioterapia (`/sessoes`) — 🔒 Requer JWT

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/sessoes` | Listar todas as sessões |
| `GET` | `/sessoes/:id` | Buscar sessão por ID |
| `POST` | `/sessoes` | Criar nova sessão |
| `PATCH` | `/sessoes/:id` | Atualizar sessão |
| `DELETE` | `/sessoes/:id` | Remover sessão |

**Exemplo — Criar sessão:**
```json
POST /sessoes
Authorization: Bearer <token>
Content-Type: application/json

{
  "focoLesao": "Ligamento anterolateral",
  "dataSessao": "2023-08-15",
  "progressoBoa": true,
  "duracaoMin": 45,
  "cavaloId": 1
}
```

**Regras de negócio:**
- `dataSessao` não pode ser posterior à data atual
- `duracaoMin` deve estar entre 30 e 90 minutos
- `focoLesao` não pode conter palavras alarmantes ("crítica", "terminal", "irreversível")
- O cavalo referenciado pelo `cavaloId` deve existir e estar em tratamento
- Não é permitida mais de uma sessão para o mesmo cavalo na mesma data
- Validação de consistência de progressão (se marcou `progressoBoa: true`, a sessão anterior para o mesmo foco deve ter declarado progresso positivo)

---

### Usuários (`/users`) — 🔒 Requer JWT + Admin

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/users` | Listar todos os usuários |
| `PATCH` | `/users/:id/activate` | Ativar/desativar um usuário |

**Exemplo — Ativar usuário:**
```json
PATCH /users/2/activate
Authorization: Bearer <token>
Content-Type: application/json

{ "ativo": true }
```

---

## 🧰 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | NestJS 11, TypeORM, SQLite, Passport JWT, class-validator, Swagger |
| Frontend | Angular 20 (Standalone), Tailwind CSS 4, RxJS |
| Monorepo | Turborepo, pnpm workspaces |
| Versionamento | Git com Conventional Commits |

---

## 📋 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm install` | Instala dependências de todos os workspaces |
| `pnpm dev` | Roda backend (:3000) e frontend (:4200) simultaneamente |
| `pnpm build` | Compila todas as aplicações |
| `pnpm lint` | Executa ESLint em todos os projetos |
| `pnpm test` | Roda os testes configurados |
