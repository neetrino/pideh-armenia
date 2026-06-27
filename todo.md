# Pideh Armenia — План доведения до production-уровня

> Стек: Next.js 15 (App Router) · Neon Postgres · Prisma · Cloudflare R2 · Upstash Redis · Vercel.
> Правила: `.cursor/rules/` (size A, npm, bcryptjs, TS strict, no `any`, no `console.log`).

---

## 📋 Фазы реализации

### Фаза 1 — Чистка кода ✅
### Фаза 2 — Миграция БД ✅
### Фаза 3 — R2 + webp ✅
### Фаза 4 — Redis ✅
### Фаза 5 — Наполнение БД ✅

### Фаза 6 — Локальная проверка ⏳ (сейчас)
- [ ] `npm run dev` — приложение на http://localhost:3000
- [ ] Главная: каталог, хиты, баннер, R2-картинки
- [ ] Корзина → checkout → заказ (guest + auth)
- [ ] Login / register / profile
- [ ] Admin: товары, заказы, категории, настройки
- [ ] `npm run build` — зелёный
- [ ] Убрать client `console.log`, strict TS/ESLint

### Фаза 7 — Деплой (только когда фаза 6 ✅)
- [ ] Env в Vercel
- [ ] `migrate deploy` + smoke-тест на prod

---

## 🚀 Локальный запуск

```bash
npm install
npm run db:migrate    # если БД пустая
npm run db:seed       # категории + 34 товара + статусы + admin
npm run dev           # http://localhost:3000
```

Admin: `ADMIN_EMAIL` / `ADMIN_PASSWORD` из `.env`.

---

## 🧹 Оставшаяся чистка

- [ ] `console.log` в client-компонентах
- [ ] `public/images/*.png` — архив после подтверждения R2
- [ ] Logo → R2 (`logo.webp`)
- [ ] Strict TS/ESLint в build

## 🔐 Безопасность

- Секреты только в `.env`. В prod — свой `ADMIN_PASSWORD`, не fallback `admin123`.
