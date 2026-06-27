# Pideh Armenia — Интернет-магазин мини-пицц

## Стек

- **Next.js 15** + TypeScript
- **Neon PostgreSQL** — база данных
- **Cloudflare R2** — хранение изображений
- **Vercel** — хостинг
- **Prisma** + **NextAuth**

## Локальная разработка

```bash
cp .env.example .env
# Заполните DATABASE_URL, NEXTAUTH_* и R2_* в .env

npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Приложение: http://localhost:3000

## Деплой на Vercel

### 1. Neon (база данных)

1. Создайте проект на [console.neon.tech](https://console.neon.tech)
2. Скопируйте **Pooled connection string**
3. Добавьте в Vercel → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
```

### 2. Cloudflare R2 (файлы)

1. Cloudflare Dashboard → R2 → Create bucket (`pideh-armenia`)
2. Settings → Public access → Enable R2.dev subdomain (или custom domain)
3. R2 → Manage R2 API Tokens → Create token
4. Добавьте в Vercel:

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=pideh-armenia
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 3. NextAuth

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<openssl rand -base64 32>
```

### 4. Deploy

```bash
# Подключите репозиторий к Vercel — build выполнится автоматически
# vercel.json запускает: prisma generate → migrate deploy → next build
```

После первого деплоя (опционально) загрузите начальные данные:

```bash
DATABASE_URL="..." npm run db:seed
```

## Структура проекта

```
src/
├── app/          # Pages & API routes
├── components/   # UI components
├── hooks/        # React hooks
├── lib/          # Prisma, auth, R2 storage
└── types/        # TypeScript types
prisma/           # Schema & migrations
scripts/          # seed.ts
docs/             # BRIEF, TECH_CARD, reference (payments, security)
.cursor/rules/    # Cursor AI development rules
archive/          # Legacy docs & scripts
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Локальный сервер |
| `npm run build` | Production сборка |
| `npm run db:seed` | Заполнить БД товарами |
| `npm run db:migrate` | Применить миграции |
