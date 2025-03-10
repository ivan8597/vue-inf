# Vue Client Manager

### Приложение для управления клиентами, построенное на Vue 3 + TypeScript с Python FastAPI бэкендом.

## Функциональность

- ✨ Создание, редактирование и удаление клиентов
- 🔍 Поиск по имени, email и телефону
- 📊 Сортировка по имени и балансу
- 📁 Архивация клиентов
- 🎯 Валидация форм
- 💫 Анимации интерфейса
- 🎨 Стильный UI с Tailwind CSS
- 🔒 REST API с FastAPI
- 📦 SQLAlchemy ORM
- 🗄️ PostgreSQL база данных

## Стек

### Frontend
- Vue 3
- TypeScript
- Pinia
- Tailwind CSS
- Animate.css
- Vitest
- Vue Test Utils

### Backend
- Python FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Alembic
- pytest

## Установка

### https://vue-inf.vercel.app/
### Frontend
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Запуск тестов
npm run test
```

### Backend
```bash
# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Установка зависимостей
pip install -r requirements.txt

# Применение миграций
alembic upgrade head

# Запуск сервера
uvicorn main:app --reload
```

## API Endpoints

```
GET    /api/clients      # Получить список клиентов
POST   /api/clients      # Создать нового клиента
GET    /api/clients/{id} # Получить клиента по ID
PUT    /api/clients/{id} # Обновить клиента
DELETE /api/clients/{id} # Удалить клиента
```

## Тестирование

### Frontend тесты
```bash
# Запуск всех тестов
npm run test

# Запуск тестов с отслеживанием изменений
npm run test:watch
```

### Backend тесты
```bash
# Запуск pytest
pytest

# Запуск с покрытием
pytest --cov=app
```

## База данных

Используется PostgreSQL. Миграции управляются через Alembic.

### Структура таблиц:
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    balance DECIMAL DEFAULT 0,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```




