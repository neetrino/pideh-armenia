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

### ✅ Решения (зафиксированы)

| Приоритет | Локаль | URL | Переключатель |
|-----------|--------|-----|----------------|
| 1 | **Армянский** | `/hy/...` | Armenia |
| 2 | **English** | `/en/...` | English |
| 3 | **Русский** | `/ru/...` | Russian |

- **Default locale:** `hy` (главный язык)
- **UI сайта:** переключатель языков в header — три пункта **Armenia | English | Russian** → смена locale, тот же URL-путь
- **Контент меню (БД):** название, описание, ингредиенты — **на всех 3 языках**
- **Admin:** при редактировании товара/категории — **вкладки сверху** (Armenia | English | Russian); в каждой вкладке **те же поля**, только для выбранного языка (удобно переводить)

### Подход

**UI-строки (кнопки, labels):** `next-intl` + `src/messages/{hy,en,ru}.json`

**Контент из БД:** таблица переводов (не дублировать колонки ×3):

```
ProductTranslation: productId + locale (hy|en|ru) → name, description, ingredients[]
CategoryTranslation: categoryId + locale → name, description
```

API отдаёт поля для текущей locale; fallback: запрошенный → hy → en → ru.

### Фазы i18n

#### 7.1 — Инфраструктура ✅
- [x] `next-intl`, locales `hy`, `en`, `ru`, default `hy`
- [x] `src/app/[locale]/...`, middleware, redirect `/` → `/hy`
- [x] `LanguageSwitcher` в Header (Armenia | English | Russian)
- [x] Навигация через `@/i18n/navigation`

#### 7.2 — UI-строки (клиент) ✅
- [x] Header, Footer, LanguageSwitcher, ProductCard
- [x] login, register, cart, checkout, order-success, profile
- [x] products, products/[id], главная (hero, features, отзывы, CTA)
- [x] about, contact (getTranslations)
- [ ] hy.json — доработать about/contact/armenian copy (частично translit)

#### 7.3 — БД + API + seed ✅
- [x] `ProductTranslation`, `CategoryTranslation`, enum `ContentLocale`
- [x] API: `?locale=hy|en|ru`, fallback hy → en → ru
- [x] Категории: `slug` (ru key) + localized `name`
- [x] Seed: ru для товаров; hy/en для категорий
- [x] Redis cache per locale
- [x] Storefront fetch с `useLocale()` + `withLocale()`

#### 7.4 — Admin (вкладки перевода)
- [ ] Товар create/edit: табы **Armenia | English | Russian**, одни и те же поля (name, description, ingredients)
- [ ] Категории — то же
- [ ] Shell admin (навигация, кнопки) — можно оставить ru или hy (уточнить при реализации)

#### 7.5 — Форматирование и SEO
- [ ] Цены AMD через `Intl` per locale
- [ ] `hreflang`, `<html lang={locale}>`, metadata

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
