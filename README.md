# Dias Locacao SaaS

Sistema profissional para gestao completa de locadora de veiculos, projetado desde o inicio para evolucao de operacao unica para modelo SaaS multiempresa (multi-tenant).

## Objetivo

Entregar uma plataforma moderna para gerir:

- clientes
- veiculos
- contratos de locacao
- pagamentos e inadimplencia
- manutencao e lava rapido
- controle de quilometragem
- dashboards administrativos
- notificacoes automaticas

## Stack Tecnica Obrigatoria

### Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- Recharts (ou Chart.js)

### Backend

- NestJS
- Node.js
- TypeScript
- JWT
- REST API

### Dados e Infra

- PostgreSQL
- Prisma ORM
- Docker
- VPS ou Cloud
- Armazenamento de arquivos local (dev) e S3 (producao)

## Arquitetura de Alto Nivel

- Estilo inicial: Monolito modular
- Evolucao futura: SaaS multi-tenant com isolamento por company_id
- Fronteiras de dominio claras para futura extracao de servicos

### Backend

- Controllers: entrada HTTP e contrato REST
- Services: regras de negocio
- Modules: isolamento por dominio
- DTOs: validacao de entrada
- Guards: JWT + permissao por papel
- Middleware: resolucao de tenant e contexto por requisicao

### Frontend

- App Router do Next.js
- Componentes por dominio
- Hooks para estado de tela
- Services para comunicacao com API
- Camada de autenticacao e autorizacao por rota

### Multi-tenant (planejado desde agora)

- Tabela companies
- Entidades de negocio com company_id obrigatorio
- Filtros de tenant aplicados no backend em toda consulta
- Usuarios associados inicialmente a uma empresa

## Modulos de Negocio

- Autenticacao e usuarios
- Dashboard administrativo
- Clientes
- Veiculos
- Locacoes e contratos
- Pagamentos e inadimplencia
- Notificacoes
- Quilometragem
- Manutencao
- Lava rapido
- Relatorios
- Auditoria

## Estrutura Planejada de Pastas

```text
Dias-Locacao/
  backend/
    src/
      common/
      modules/
        auth/
        users/
        companies/
        clients/
        vehicles/
        rentals/
        contracts/
        payments/
        maintenance/
        washings/
        notifications/
        reports/
        dashboard/
        audit-logs/
    prisma/
      schema.prisma
      migrations/
  frontend/
    src/
      app/
        login/
        dashboard/
        clientes/
        veiculos/
        locacoes/
        contratos/
        pagamentos/
        manutencoes/
        lavagens/
        relatorios/
      components/
      hooks/
      services/
      types/
  docs/
    VERSIONING.md
```

## Banco de Dados (resumo)

Entidades nucleares:

- companies
- users
- clients
- client_addresses
- client_documents
- vehicles
- vehicle_photos
- rentals
- contracts
- payments
- maintenance
- washings
- notifications
- audit_logs

Principios:

- Integridade referencial com chaves estrangeiras
- Indices para consultas por status, datas e company_id
- Rastreabilidade completa para auditoria

## Seguranca

- JWT com refresh token
- Senha com hash seguro
- Controle de acesso por papel: ADMIN e EMPLOYEE
- Validacao de payload em todos os endpoints
- Trilha de auditoria para acoes sensiveis
- Rate limit em rotas criticas

## Versionamento

A estrategia completa esta em VERSIONING.md.

Resumo:

- Versao de produto: SemVer (major.minor.patch)
- Versao de commit/build: gerada automaticamente por commit
- Releases de feature: incremento de minor
- Fixes: incremento de patch

## Roadmap Inicial de Implementacao

### Fase 0 - Fundacao

- Definir monorepo e padroes de codigo
- Criar Docker base (backend, frontend, postgres)
- Configurar Prisma e migracao inicial
- Configurar autenticacao JWT e RBAC

### Fase 1 - Operacao Essencial

- Clientes
- Veiculos
- Locacoes e contratos
- Pagamentos

### Fase 2 - Operacao Avancada

- Inadimplencia automatica
- Notificacoes por canais
- Manutencao e lava rapido
- Dashboards e relatorios

### Fase 3 - Pronto para SaaS

- Hardening multi-tenant
- Observabilidade e custos
- Políticas de backup e retencao
- Automacao de deploy

## O que falta para comecar agora

- Aprovar este README e a politica de versionamento
- Criar scaffold inicial de backend NestJS e frontend Next.js
- Definir variaveis de ambiente e segredos
- Criar schema Prisma inicial e migracao 0001
- Subir ambiente local via Docker e validar login base

## Licenca

Este repositorio utiliza MPL 2.0 (arquivo LICENSE).
