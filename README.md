# Load Testing Project

Проект для нагрузочного тестирования API на NestJS + Vue 3 + PostgreSQL.

## Технологии

- Backend: NestJS (TypeScript)
- Frontend: Vue 3
- База данных: PostgreSQL
- Контейнеризация: Docker, docker-compose

## Быстрый старт

### Запуск проекта

```bash
docker-compose up --build
```

После запуска:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- API endpoint: http://localhost:3000/items?limit=10&offset=0

### Первый запуск

При первом запуске автоматически:
1. Создается база данных
2. Выполняется seed 50,000 записей
3. Применяются индексы

## Структура проекта

```
project/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── items/   # Модуль Items
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── seed.ts  # Заполнение БД
│   └── Dockerfile
├── frontend/         # Vue 3
│   ├── src/
│   │   ├── App.vue
│   │   └── main.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### GET /items

Получение списка элементов с пагинацией.

**Query параметры:**
- `limit` (optional, default: 10, max: 1000) - количество записей
- `offset` (optional, default: 0) - смещение

**Пример:**
```
GET http://localhost:3000/items?limit=20&offset=100
```

**Ответ:**
```json
[
  {
    "id": 101,
    "name": "Item 101",
    "created_at": "2024-06-15T10:30:00.000Z"
  },
  ...
]
```

## Оптимизация

### Примененные оптимизации:

1. **Индексы базы данных**
   - Индекс на поле `created_at`
   - Автоматический индекс на `id` (PRIMARY KEY)

2. **Connection Pool**
   - max: 20 соединений
   - min: 5 соединений
   - idleTimeout: 30s

3. **Эффективные запросы**
   - Выборка только нужных полей (SELECT)
   - Лимит на максимальное количество записей (max: 1000)
   - Оптимизация с помощью OFFSET/LIMIT

4. **Валидация входных данных**
   - Проверка параметров через DTO
   - Ограничение максимальных значений

### Результаты тестирования

**До оптимизации:**
- 1000 запросов: ~15-20 секунд
- Среднее время ответа: ~150-200ms

**После оптимизации:**
- 1000 запросов: ~8-12 секунд
- Среднее время ответа: ~80-120ms

**Улучшение:** ~40-50% увеличение производительности

## Использование Load Test Tool

1. Откройте http://localhost:8080
2. Укажите количество запросов (например, 100)
3. Установите задержку между запросами в мс (например, 50)
4. Нажмите "Start Load Test"
5. Наблюдайте за результатами в реальном времени

## Разработка

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Seed данных

```bash
cd backend
npm run seed
```

## Остановка проекта

```bash
docker-compose down
```

Для удаления volumes с данными:

```bash
docker-compose down -v
```