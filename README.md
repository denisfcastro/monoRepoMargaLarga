# Monorepo UEG - Manga Larga

Este é um monorepo orquestrado com **Turborepo** e **pnpm workspaces**, contendo aplicações (backend e frontend) e pacotes compartilhados.

## Estrutura do Projeto

```text
monorepo-ueg/
├── apps/
│   ├── backend/           # NestJS (migrado do projeto original)
│   └── frontend/          # Angular 20 Standalone
├── packages/
│   ├── utils/             # Tipos e utilitários compartilhados
│   ├── typescript-config/ # tsconfig base compartilhado
│   └── eslint-config/     # ESLint compartilhado
├── .agents/
│   ├── rules/             # Regras para agentes de IA
│   └── skills/            # Skills do workspace
├── specs/                 # Documentação técnica e de negócio
├── turbo.json             # Configuração da pipeline do Turborepo
├── pnpm-workspace.yaml    # Configuração de workspaces do pnpm
└── package.json           # Dependências e scripts globais
```

## Comandos

- `pnpm install` - Instala dependências de todos os workspaces.
- `pnpm dev` - Roda todas as aplicações em modo de desenvolvimento simultaneamente via Turborepo.
- `pnpm build` - Compila as aplicações (frontend e backend).
- `pnpm lint` - Executa o ESLint em todos os projetos que possuírem este script.
- `pnpm test` - Roda os testes configurados.
