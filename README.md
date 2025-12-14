📂 Структура проекта
Code
Monorepo/
├─ backend/                      # Бэкенд на NestJS
│  ├─ src/                       # Исходный код (модули, контроллеры, сервисы)
│  ├─ test/                      # Unit и e2e тесты
│  ├─ package.json               # Зависимости backend
│  └─ tsconfig.json              # Конфигурация TypeScript
│
├─ frontend/                     # Фронтенд на React + Vite
│  ├─ src/                       # Компоненты, страницы, хуки
│  ├─ public/                    # Публичные файлы
│  ├─ package.json               # Зависимости frontend
│  └─ vite.config.js             # Конфигурация Vite
│
├─ package.json                  # Корневые скрипты монорепозитория
├─ pnpm-workspace.yaml           # (если используется pnpm)
└─ README.md                     # Этот файл
⚙️ Установка зависимостей
Установка зависимостей монорепозитория
bash
npm install
или при использовании pnpm:

bash
pnpm install
🗄️ Конфигурация
Backend (NestJS)
В backend/.env (если используется):

env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
Frontend (React + Vite)
В frontend/.env:

env
VITE_API_URL=http://localhost:3000
🚀 Запуск
1. Бэкенд (NestJS)
bash
npm run backend:dev
или вручную:

bash
cd backend
npm run start:dev
Backend доступен по адресу:

Code
http://localhost:3000
Документация Swagger:

Code
http://localhost:3000/api
2. Фронтенд (React + Vite)
bash
npm run frontend:dev
или вручную:

bash
cd frontend
npm run dev
Интерфейс доступен по адресу:

Code
http://localhost:5173
🔗 Основные команды
Backend
npm run backend:dev — запуск разработки

npm run backend:build — сборка

npm run backend:test — unit-тесты

npm run backend:test:e2e — e2e-тесты

npm run backend:test:cov — покрытие тестами

Frontend
npm run frontend:dev — запуск разработки

npm run frontend:build — сборка

npm run frontend:preview — предпросмотр билда

🧱 Архитектура
Backend (NestJS)
Модульная структура

Контроллеры — обработка HTTP-запросов

Сервисы — бизнес-логика

Guards, Pipes, Interceptors — расширение поведения

Поддержка WebSockets, GraphQL, Microservices

Frontend (React + Vite)
Компонентный подход

Быстрая сборка и HMR

ESLint для контроля качества

Возможность включения React Compiler

🛠️ Типичные проблемы
CORS ошибки → проверь VITE_API_URL

Backend не стартует → проверь .env и подключение к БД

Frontend не видит API → убедись, что backend работает на localhost:3000

📚 Полезные ресурсы
NestJS
Документация — https://docs.nestjs.com

Курсы — https://courses.nestjs.com

Devtools — https://devtools.nestjs.com

React + Vite
Документация Vite — https://vite.dev

Документация React — https://react.dev

📄 Лицензия
Проект распространяется под лицензией MIT.
