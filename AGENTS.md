# AGENTS.md

## Contexto do Projeto
- Projeto: `aura-frontend`
- Escopo: **apenas frontend** (sem backend ativo neste repositório)
- Stack principal:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript (`strict: true`)
  - Tailwind CSS v4 (`@import "tailwindcss"` em `globals.css`)
  - MUI v7 (inclui `@mui/material-nextjs`)
  - Framer Motion

## Objetivo do Agente
Atuar como engenheiro frontend neste projeto, preservando a arquitetura atual e evitando mudanças que assumam backend pronto.

## Comandos de Trabalho
- Instalar dependências: `pnpm install`
- Desenvolvimento: `pnpm dev`
- Lint: `pnpm lint`
- Build de verificação: `pnpm build`
- Rodar produção local: `pnpm start`

## Estrutura Relevante
- `src/app`: rotas App Router
- `src/components`: componentes reutilizáveis
- `src/lib`: estado/localStorage e helpers de domínio (catalog, carrinho, checkout)
- `mock`: dados mockados (catálogo e carrossel)
- `public`: assets estáticos
- `teste/schema.ts`: referência de schema SQL (informativo, fora do fluxo frontend)

## Arquitetura Funcional Atual
- Catálogo/vitrine usa dados locais de `mock/catalog.ts` com possibilidade de override via admin local.
- Painel admin (`/admin`) persiste no `localStorage` e alimenta vitrine por evento.
- Carrinho e checkout também são client-side com `localStorage`.
- Não há integração real com API/back-end neste momento.

## Chaves e Eventos de Estado Local
- Catálogo/Admin:
  - Key: `aura-admin-store-v1`
  - Event: `aura-admin-store-updated`
- Carrinho:
  - Key: `aura-cart-v1`
  - Event: `aura-cart-updated`
- Pedidos checkout:
  - Key: `aura-checkout-orders-v1`
- Área do cliente:
  - Key: `aura-client-state-v1`

## Convenções de Código
- Usar alias `@/` para imports internos.
- Manter componentes com hooks como `use client`.
- Preservar padrão visual existente (Tailwind utilitário + gradientes + cards + botões rounded).
- Reutilizar wrappers de animação:
  - `MotionReveal`
  - `MotionStagger`
  - `MotionStaggerItem`
- Textos da UI devem permanecer em português (pt-BR).
- Em links internos, o projeto usa amplamente `prefetch={false}`; manter consistência ao editar páginas existentes.

## Rotas e Alias Importantes
- Rotas principais:
  - `/`
  - `/products`
  - `/products/[slug]`
  - `/collections`
  - `/cart`
  - `/checkout`
  - `/checkout/success/[orderNumber]`
  - `/admin`
  - `/client`
  - `/about`, `/contact`, `/login`, `/register`
- Alias/redirects legados:
  - `/colections` -> `/collections`
  - `/cadastro` -> `/register`
  - `/cliente` -> `/client`

## Regras para Alterações
- Não assumir backend real; se necessário, manter fallback local/mock.
- Não quebrar persistência local existente (keys/eventos).
- Evitar renomear arquivos/componentes já em uso sem necessidade (ex.: `Caroussel`, `CustonCard`).
- Preferir mudanças pontuais e seguras em páginas/componentes já existentes.
- Se mexer em fluxo de compra/admin, validar impacto em:
  - `src/lib/storefront-catalog.ts`
  - `src/lib/cart-store.ts`
  - `src/lib/checkout-store.ts`
  - `src/app/admin/page.tsx`

## Checklist de Entrega
Antes de concluir qualquer tarefa:
1. Rodar `pnpm lint`
2. Rodar `pnpm build` quando a mudança afetar rotas/estado global/checkout/admin
3. Confirmar que rotas críticas continuam navegáveis:
   - `/products`
   - `/products/[slug]`
   - `/cart`
   - `/checkout`
   - `/admin`

## Restrições
- Não adicionar dependências novas sem necessidade clara.
- Não converter o projeto para outro framework/arquitetura.
- Não remover fallback mock/localStorage sem instrução explícita.
- Não tratar este repositório como backend.
