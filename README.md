# Vue Client Manager

Система управления клиентами на Vue.js + FastAPI + PostgreSQL





## Функциональность

- ✨ Создание, редактирование и удаление клиентов
- 🔍 Поиск по имени, email и телефону
- 📊 Сортировка по имени и балансу
- 📁 Архивация клиентов
- 🎯 Валидация форм
- 💫 Анимации интерфейса
- 🎨 UI с Tailwind CSS
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


### Frontend
```bash
# Установка зависимостей
npm install


### Backend
```bash
cd backend
uvicorn main:app --reload
```


### Docker
# Запуск всего приложения
docker-compose up
# Пересборка при изменениях
docker-compose up --build

 Откройте http://localhost







## Тестирование

### Frontend тесты

cd frontend 
npm run test

### Backend тесты
cd backend && source ../venv/bin/activate && python -m pytest -v





