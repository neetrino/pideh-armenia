# Windows Development Setup - Pideh Armenia

## 🖥️ Настройка для Windows

### Предварительные требования
- PostgreSQL 17 установлен в `C:\Program Files\PostgreSQL\17`
- Node.js и npm установлены
- Git установлен

### 🚀 Быстрый старт

1. **Клонирование репозитория:**
```bash
git clone <repository-url>
cd pideh-armenia
git checkout Windows-Dev
```

2. **Установка зависимостей:**
```bash
npm install
```

3. **Настройка базы данных:**
```bash
# Создание базы данных (пароль postgres: 1452)
$env:PGPASSWORD="1452"; & "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres pideh_armenia

# Применение миграций
$env:DATABASE_URL="postgresql://postgres:1452@localhost:5432/pideh_armenia?schema=public"; npx prisma db push

# Заполнение тестовыми данными
npm run db:seed
```

4. **Запуск приложения:**
```bash
npm run dev
```

5. **Запуск Prisma Studio:**
```bash
$env:DATABASE_URL="postgresql://postgres:1452@localhost:5432/pideh_armenia?schema=public"; npx prisma studio
```

### 📁 Файлы конфигурации

- `.env.local` - переменные окружения для Windows
- `WINDOWS_SETUP.md` - этот файл с инструкциями

### 🔧 Полезные команды

```bash
# Проверка статуса базы данных
$env:PGPASSWORD="1452"; & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -l

# Подключение к базе данных
$env:PGPASSWORD="1452"; & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d pideh_armenia

# Сброс базы данных
$env:DATABASE_URL="postgresql://postgres:1452@localhost:5432/pideh_armenia?schema=public"; npx prisma migrate reset --force
```

### 🌐 Доступные URL

- **Приложение:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555
- **pgAdmin 4:** http://localhost:5050 (если установлен)

### 📊 Данные по умолчанию

- **Товаров:** 34
- **Пользователей:** 2
  - Тестовый: test@pideh-armenia.am
  - Админ: admin@pideh-armenia.am (пароль: admin123)
- **Заказов:** 1 (тестовый)

### ⚠️ Важные заметки

1. **Пароль PostgreSQL:** 1452
2. **Ветка разработки:** Windows-Dev
3. **Основная ветка:** Development (для Mac)
4. **Файл .env.local** содержит настройки для Windows

### 🔄 Синхронизация с Mac

При возврате на Mac:
1. Переключиться на ветку `Development`
2. Удалить файл `.env.local`
3. Настроить переменные окружения для Mac
4. Выполнить `npm run db:seed` для заполнения данных
