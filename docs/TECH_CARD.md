# Pideh Armenia — Технологическая карта

**Проект:** Pideh Armenia  
**Размер:** A (small)  
**Дата:** 2026-06-27  
**Статус:** ✅ подтверждён

---

## 1. Основа

| Параметр | Решение | Статус |
|----------|---------|--------|
| Размер проекта | A — simple layout | ✅ |
| Архитектура | Next.js monolith (app + components + lib) | ✅ |
| Package manager | npm | ✅ |
| Node.js | 20.x LTS | ✅ |
| TypeScript | 5.x, strict | ✅ |
| Git | feature branches | ✅ |

## 2. Frontend

| Параметр | Решение | Статус |
|----------|---------|--------|
| Framework | Next.js 15.5, App Router | ✅ |
| Стили | Tailwind CSS 4 | ✅ |
| UI | custom components (`src/components/ui/`) | ✅ |
| State | React Context (cart, settings) | ✅ |
| Формы | React Hook Form + Zod | ✅ |
| Data fetching | Server Components + fetch в API routes | ✅ |
| i18n | не требуется | ➖ |
| PWA | sw.js (базовый) | 🔄 |

## 3. Backend

| Параметр | Решение | Статус |
|----------|---------|--------|
| Тип | Next.js API Routes | ✅ |
| Валидация | Zod | ✅ |
| API | REST | ✅ |
| Загрузка файлов | API routes → R2 (`src/lib/storage.ts`) | ✅ |

## 4. База данных

| Параметр | Решение | Статус |
|----------|---------|--------|
| СУБД | PostgreSQL (Neon) | ✅ |
| ORM | Prisma 6.x | ✅ |
| Миграции | `prisma migrate deploy` (Vercel build) | ✅ |
| Seed | `scripts/seed.ts` + `data/buy-am-products.json` | ✅ |

## 5. Аутентификация

| Параметр | Решение | Статус |
|----------|---------|--------|
| Решение | NextAuth 4.x (Credentials) | ✅ |
| Сессии | JWT | ✅ |
| Роли | USER, ADMIN | ✅ |
| Хеш паролей | bcryptjs | ✅ |

## 6. Хранилище

| Параметр | Решение | Статус |
|----------|---------|--------|
| Файлы | Cloudflare R2 (S3-compatible) | ✅ |
| CDN | R2 public URL + next/image | ✅ |
| Локально | `public/images/` fallback в dev | ✅ |

## 7. DevOps

| Параметр | Решение | Статус |
|----------|---------|--------|
| Хостинг | Vercel | ✅ |
| CI/CD | Vercel build + `vercel.json` | ✅ |
| Env | `.env` локально, Vercel env в production | ✅ |

## 8. Документация

| Документ | Статус |
|----------|--------|
| docs/BRIEF.md | ✅ |
| docs/TECH_CARD.md | ✅ |
| docs/01-ARCHITECTURE.md | ✅ |
| README.md | ✅ |
| .env.example | ✅ |

## Следующие этапы

- [ ] Миграция `public/images/` → R2
- [ ] Интеграция Idram / ArCa / Ameriabank
- [ ] Включить ESLint/TS checks в build (сейчас ignoreDuringBuilds)
