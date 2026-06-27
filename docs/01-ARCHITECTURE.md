# Pideh Armenia — Архитектура

**Размер:** A (small)  
**Обновлено:** 2026-06-27

---

## Назначение

Fullstack Next.js приложение: каталог, корзина, заказы, админка. Serverless на Vercel, данные в Neon, файлы в Cloudflare R2.

## Высокоуровневая схема

```
┌──────────────────┐     ┌──────────────────┐
│   Browser/PWA    │────▶│  Vercel (Next.js) │
│   React 19       │     │  App Router + API  │
└──────────────────┘     └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │   Neon   │ │ Cloudflare│ │ NextAuth │
              │ Postgres │ │    R2     │ │   JWT    │
              └──────────┘ └──────────┘ └──────────┘
```

## Структура проекта

```
src/
├── app/              # Pages + API routes
│   ├── api/          # REST endpoints
│   ├── admin/        # Admin UI
│   ├── products/     # Catalog
│   └── ...
├── components/       # UI components
├── hooks/            # useCart, useSettings
├── lib/              # prisma, auth, storage (R2)
├── constants/        # company, colors
└── types/            # TypeScript types
prisma/               # schema + migrations
public/               # logo, sw.js, local images (dev)
data/                 # seed JSON
docs/                 # BRIEF, TECH_CARD, reference
archive/              # legacy docs & scripts
.cursor/rules/        # Cursor AI rules
```

## Основные сущности

| Entity | Описание |
|--------|----------|
| User | Пользователи (USER / ADMIN) |
| Category | Категории меню |
| Product | Товары с ценой, изображением, статусом |
| Order | Заказы (guest + registered) |
| OrderItem | Позиции заказа |
| Settings | Key-value настройки (логотип и др.) |

## Поток заказа

```
1. Пользователь → /products → добавляет в корзину (client state)
2. /checkout → POST /api/orders
3. API → Prisma → Neon (Order + OrderItems)
4. /order-success
5. Admin → /admin/orders → PATCH status
```

## Аутентификация

- NextAuth Credentials provider
- JWT session strategy
- Middleware защищает `/admin/*` и admin API

## Файловое хранилище

- Production: `src/lib/storage.ts` → Cloudflare R2
- Development: fallback в `public/` если R2 env не задан

## Связанные документы

- [TECH_CARD.md](./TECH_CARD.md)
- [BRIEF.md](./BRIEF.md)
- Платежи: `docs/reference/payment integration/payments/00-INDEX.md`
- Security checklist: `docs/reference/Check/Quality/project-quality-checklist.md`
