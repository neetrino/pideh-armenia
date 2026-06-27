# Pideh Armenia — План реализации

> Next.js 15 · Neon · Prisma · R2 · Upstash Redis · Vercel  
> Правила: `.cursor/rules/` (size A)

---

## ✅ Завершённые этапы

| # | Этап | Статус |
|---|------|--------|
| 1 | Чистка кода, logger, Zod, shared prisma | ✅ |
| 2 | БД: Int-деньги, enum оплаты, индексы | ✅ |
| 3 | R2 + webp, `data/image-map.json` | ✅ |
| 4 | Redis: кэш, rate-limit | ✅ |
| 5 | Seed: upsert, статусы HIT/BANNER | ✅ |
| 6 | Локальная проверка + финальная чистка | ✅ |

### Этап 6 — что сделано
- Локальные product images удалены (`public/images/` ~44 MB)
- Источник картинок: **только R2** + `data/image-map.json`
- Удалены: `scripts/Aarchive/`, `scripts/migrate-images-to-r2.ts`, `Documents/`
- Seed упрощён: без `--upload-images`, без чтения `public/images/`
- `public/` остался: `logo.png`, `sw.js` (logo → R2 — опционально позже)

---

## ⏭ Этап 7 — Мультиязычность (i18n)

**Цель:** интерфейс на **русском + армянском** (основные языки аудитории в Армении). Английский — опционально, если нужен.

### Подход (минимальный, production-grade)

**Библиотека:** `next-intl` (стандарт для App Router)

**Роутинг:** префикс локали — `/ru/...`, `/hy/...`  
**Default:** `ru` (как сейчас в BRIEF)

### Фазы i18n

#### 7.1 — Инфраструктура
- [ ] Установить `next-intl`
- [ ] Структура: `src/messages/ru.json`, `src/messages/hy.json`
- [ ] `src/i18n/config.ts` — locales, defaultLocale
- [ ] Middleware: locale detection + redirect `/` → `/ru`
- [ ] Перенести `src/app/*` → `src/app/[locale]/*` (layout, pages)
- [ ] `generateStaticParams` для локалей

#### 7.2 — UI-строки (клиент)
- [ ] Header, Footer, MobileHeader, DesktopHeader
- [ ] Главная, /products, /products/[id]
- [ ] Cart, Checkout, Order-success
- [ ] Login, Register, Profile
- [ ] Contact, About (если есть)

#### 7.3 — Admin
- [ ] Admin-панель: оставить **только ru** (или ru+hy — решить)
- [ ] API error messages: ru по умолчанию, ключи для клиента

#### 7.4 — Контент из БД
- [ ] **Фаза A (быстро):** названия/описания товаров остаются как в БД (русский контент)
- [ ] **Фаза B (позже, если нужно):** поля `nameHy`, `descriptionHy` в Product/Category или отдельная таблица переводов

#### 7.5 — Форматирование
- [ ] Цены: `Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD' })` — без копеек
- [ ] Даты заказов в admin/profile

#### 7.6 — SEO
- [ ] `hreflang` в layout
- [ ] `<html lang={locale}>`
- [ ] Metadata per locale

### Решения перед стартом (нужно подтвердить)

1. **Локали:** `ru` + `hy` достаточно? Нужен `en`?
2. **Контент меню:** переводить названия пиде в БД сейчас или только UI-оболочку?
3. **Admin:** один язык (ru) или тоже hy?

---

## Этап 8 — Деплой (после i18n)

- [ ] Strict TS/ESLint в build
- [ ] Env в Vercel
- [ ] `migrate deploy` + smoke-тест prod

---

## 🚀 Локальный запуск

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev    # http://localhost:3000
```

Admin: `ADMIN_EMAIL` / `ADMIN_PASSWORD` из `.env`.

## 🔐 Безопасность

Секреты только в `.env`. В prod — свой `ADMIN_PASSWORD`.
