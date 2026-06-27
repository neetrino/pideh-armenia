# Pideh Armenia — Техническое задание

> Интернет-магазин мини-пицц (пиде) в формате аджарских хачапури.
> Статус: **production-ready**, деплой на Vercel + Neon + Cloudflare R2.

---

## Описание

Онлайн-магазин доставки мини-пицц Pideh Armenia. Каталог товаров, корзина, оформление заказа, личный кабинет, админ-панель для управления товарами, категориями и заказами.

## Целевая аудитория

- Покупатели в Армении — заказ через сайт/мобильный браузер
- Администраторы — управление меню, заказами, настройками

## Основные функции

1. Каталог и карточки товаров — **высокий**
2. Корзина и checkout — **высокий**
3. Регистрация / авторизация (NextAuth) — **высокий**
4. Админ-панель (товары, категории, заказы, настройки) — **высокий**
5. Загрузка изображений (R2) — **высокий**
6. Платёжные системы (Idram, ArCa, Ameriabank) — **средний** (планируется)
7. PWA / Service Worker — **низкий** (sw.js уже есть)

## Stack

- **Frontend + API:** Next.js 15 (App Router), React 19, Tailwind CSS 4
- **БД:** Neon PostgreSQL + Prisma
- **Auth:** NextAuth (Credentials, JWT)
- **Файлы:** Cloudflare R2
- **Хостинг:** Vercel

## Интеграции

- [x] PostgreSQL (Neon)
- [x] Cloudflare R2
- [x] Auth (NextAuth)
- [ ] Idram — см. `docs/reference/payment integration/payments/IDRAM-INTEGRATION.md`
- [ ] ArCa — см. `docs/reference/payment integration/payments/ARCA-INTEGRATION.md`
- [ ] Ameriabank — см. `docs/reference/payment integration/payments/AMERIABANK-INTEGRATION.md`
- [ ] Email (Resend) — не требуется на текущем этапе

## Язык интерфейса

- **3 языка:** армянский (основной), English, русский
- **Default locale:** `hy` — URL `/hy/...`
- **Переключатель в header:** Armenia | English | Russian
- **Контент товаров/категорий:** переводы в БД; в admin — вкладки по языкам с одинаковыми полями

## Ограничения

- Serverless (Vercel) — без локальной записи файлов в production
- Изображения только через R2 в production
