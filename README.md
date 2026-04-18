
# User Service API

Простой backend-сервис для управления пользователями, разработанный с использованием Node.js, TypeScript, Prisma ORM и PostgreSQL.

# Функциональность

Сервис реализует базовую работу с пользователями:

- Регистрация пользователя
- Авторизация (JWT)
- Получение пользователя по ID
- Роли пользователей: ADMIN / USER
- Активация / деактивация пользователя

# Middleware:
- Валидация входящих данных (Validator middleware)
- Ограничение количества запросов (Rate Limiter)
- Обработка ошибок (Error Handling middleware)
- Проверка ролей пользователей (Role-based access control)
- Проверка прав доступа к ресурсам (Authorization checks)

# Стек технологий
- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (аутентификация)
- Express

# Структура проекта
prisma/
 - ├── schema.prisma
 - └── migrations/
- src/
- ├── config/
- ├── controllers/
- ├── dto/
- ├── enums/
- ├── middlewares/
- ├── routes/
- ├── services/
- ├── utils/
- ├── validators/
- └── index.ts
- .env
- .gitignore
- package.json
- tsconfig.json

# Установка и запуск
1. Клонировать проект
git clone https://github.com/shuhratkarimov/effective-mobile-project.git
cd effective-mobile-project
2. Установить зависимости
npm install
3. Настроить .env

Создай файл .env в корне проекта:

- PORT=4000
- DATABASE_URL="postgresql://postgres:shuhrat0049@localhost:5432/project1"
- JWT_ACCESS_SECRET=your_secret_key
- JWT_ACCESS_EXPIRES_IN=15m
- JWT_REFRESH_SECRET=your_secret_key2
- JWT_REFRESH_EXPIRES_IN=7d
- NODE_ENV=development

# Подключение к PostgreSQL
- USER — имя пользователя PostgreSQL (например: postgres)
- PASSWORD — пароль базы данных
- project1 — название базы данных

4. Настроить базу данных
- npx prisma generate
- npx prisma migrate dev --name init

или (быстрый вариант):
- npx prisma migrate reset
- npx prisma db push

5. Запуск проекта
- npm run dev

# Prisma модель User
model User {
- id        String   @id @default(uuid())
- fullName  String
- birthDate DateTime
- email     String   @unique
- password  String
- role      Role     @default(USER)
- isActive  Boolean  @default(true)
}

enum Role {
  ADMIN
  USER
}

# Примечания
- Все пароли хранятся в хешированном виде (bcrypt)
- JWT используется для защиты приватных маршрутов
- Middleware обрабатывает ошибки и ограничивает запросы

# Правила доступа (Business Logic)
- Пользователь может блокировать только свой аккаунт
- Администратор имеет право блокировать любого пользователя
- Обычный пользователь не имеет доступа к управлению другими аккаунтами
- Администратор не может блокировать собственный аккаунт

# Возможные улучшения
- Refresh Token система
- Email верификация
- Forgot / Reset password flow
- Логирование (Winston / Pino)
- Docker контейнеризация
- CI/CD pipeline
- Swagger / OpenAPI documentation
- Unit & integration tests (Jest / Supertest)
- Account locking after failed login attempts
- Audit logs (user activity tracking)
