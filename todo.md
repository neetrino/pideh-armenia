# Pideh Armenia — План доведения до production-уровня

> Аудит выполнен как senior developer / архитектор. Ниже найденные проблемы и план по фазам.
> Стек: Next.js 15 (App Router) · Neon Postgres · Prisma · Cloudflare R2 · Upstash Redis · Vercel.
> Правила: `.cursor/rules/` (size A, npm, bcryptjs, TS strict, no `any`, no `console.log`).

---

## 🔴 Найденные проблемы (аудит)

### Соответствие правилам (нарушения `.cursor/rules`)
- [ ] `src/app/api/products/route.ts` — битый/мёртвый импорт `sampleProducts` из `@/constants/products` (файла нет).
- [ ] `any` в коде: `whereClause: any`, `items.map((item: any) ...)` — нарушает `03-typescript` (no `any`).
- [ ] `console.log` в production-путях (orders, products, page.tsx, checkout и др.) — нарушает `00-core` (use logger).
- [ ] `new PrismaClient()` создаётся повторно в `api/orders/route.ts` (и был в `auth.ts`) вместо общего `@/lib/prisma` — риск исчерпания пула на Neon serverless (`06-database`).
- [ ] Дублирование бизнес-логики: `POST /api/products` и `POST /api/admin/products` создают товар по-разному; `/api/products` POST без проверки прав (security-дыра).
- [ ] Нет валидации входных данных через Zod на boundary (`08-security`, `07-api-design`).
- [ ] `next.config.ts` — `ignoreDuringBuilds: true` + `ignoreBuildErrors: true` маскируют ошибки (вернуть после чистки).

### Дубликаты / мусор
- [ ] `/api/products/[id]/optimized` + `/products/[id]/optimized` — параллельные «оптимизированные» версии. Решить: оставить одну реализацию.
- [ ] Эндпоинты `featured` / `banner` / основной список — частично дублируют выборку. Свести к одному кэш-слою.

### База данных (`prisma/schema.prisma`)
- [ ] `price`/`total` как `Float` — анти-паттерн для денег. Драм без копеек → перейти на `Int`.
- [ ] Нет индексов на FK и фильтруемых полях: `Product.categoryId`, `Product.status`, `Order.userId`, `Order.status`, `Order.createdAt`, `OrderItem.orderId/productId`.
- [ ] `Order.paymentMethod` — свободная строка. Сделать `enum PaymentMethod` (IDRAM, ARCA, AMERIABANK, CASH).
- [ ] Нет `slug` у `Product` (для SEO-URL) — опционально.

### Хранение файлов (R2 + webp)
- [ ] Изображения лежат локально в `public/images/*.png` — на Vercel запись в FS недоступна, нужен R2.
- [ ] Upload-роуты не конвертируют в webp (нет `sharp`).
- [ ] Пути товаров в БД/`data/*.json` указывают на `/images/*.png` — перевести на R2-ключи.

### Redis (Upstash) — не используется
- [ ] Подключён в `.env`, но нигде не задействован: нет кэша списков, нет rate-limit.

---

## 📋 Фазы реализации

### Фаза 1 — Чистка кода и соответствие правилам ✅ ВЫПОЛНЕНО
- [x] Удалить мёртвый импорт `sampleProducts`; удалить неиспользуемый код.
- [x] Заменить `any` на типы (`Prisma.ProductWhereInput`, Zod-инференс) в orders/products/featured.
- [x] Ввести `src/lib/logger.ts` и убрать `console.log/error` из API-путей.
- [x] Все API-роуты — на общий `@/lib/prisma` (orders, register, profile, delete, stats, validate).
- [x] Убрать незащищённый `POST /api/products`; единственный путь создания — `/api/admin/products`.
- [x] Добавить Zod-схемы (`src/lib/validations.ts`): register / order / profile / validate.
- [x] Удалить `optimized`-дубли (страница + API-роут) — на них ничего не ссылалось.
- [x] `npm run build` — зелёный.

### Фаза 2 — Аудит и миграция БД ⚠️ (требует подтверждения — меняет схему и бизнес-логику)
- [ ] `Float → Int` для `Product.price`, `Order.total`, `OrderItem.price` + правки в корзине/checkout.
- [ ] Добавить индексы (FK + фильтры/сортировки).
- [ ] `paymentMethod` → `enum PaymentMethod`.
- [ ] (Опц.) `slug` у `Product`.
- [ ] Сгенерировать и применить миграцию: `npm exec prisma migrate dev` (локально) → `migrate deploy` (prod).

### Фаза 3 — R2 + webp pipeline
- [ ] Добавить `sharp` (конвертация в webp).
- [ ] Скрипт `scripts/migrate-images-to-r2.ts`: `public/images/*` → webp → upload в R2 (`images/`).
- [ ] Обновить `src/lib/storage.ts`: при загрузке конвертировать в webp, ключи `images/<slug>-<hash>.webp`.
- [ ] Обновить upload-роуты (`/api/upload`, `/api/upload-image`, `/api/upload-logo`) на webp+R2.
- [ ] Обновить `data/buy-am-products.json` (или маппинг при сидинге) на R2-URL.
- [ ] Убрать локальный FS-fallback записи после переезда (оставить только R2 в prod).

### Фаза 4 — Redis (Upstash) интеграция
- [ ] Добавить `@upstash/redis` (+ `@upstash/ratelimit`).
- [ ] `src/lib/redis.ts` — клиент + типобезопасные хелперы `cacheGet/cacheSet/invalidate`.
- [ ] Кэш: список товаров, featured, banner, категории (TTL + теги для инвалидации).
- [ ] Инвалидация кэша при create/update/delete товара и категории.
- [ ] Rate-limit на `auth/register`, `login`, `POST /api/orders`.

### Фаза 5 — Наполнение БД
- [ ] Обновить `scripts/seed.ts` (Int-цены, R2-пути, идемпотентный upsert вместо deleteMany).
- [ ] Залить категории + товары из `data/buy-am-products.json` в Neon.
- [ ] Создать admin-пользователя (пароль — из env, не хардкод).

### Фаза 6 — Финал и деплой
- [ ] Вернуть `eslint`/`typescript` проверки в build (`next.config.ts`).
- [ ] `npm run build` без ошибок; прогон ключевых сценариев.
- [ ] Env в Vercel (Neon, R2, Upstash, NextAuth).
- [ ] Деплой + `migrate deploy` + проверка.

---

## ⚠️ Решения, требующие подтверждения
1. **Деньги `Float → Int`** (фаза 2) — затрагивает схему БД и расчёты. Рекомендую: да (драм целочисленный).
2. **`paymentMethod` → enum** — фиксирует список методов оплаты.
3. **`optimized`-дубли** — какой вариант оставить (обычный vs optimized) для страницы/товара.
4. **Сидинг**: `deleteMany` (полная переинициализация) vs `upsert` (без потери заказов). Рекомендую upsert.

## 🔐 Заметка по безопасности
- Реальные ключи (Neon/R2/Upstash) сейчас в `.env` — он в `.gitignore`, в репозиторий не попадёт. Не коммитить. При утечке — ротация токенов.
