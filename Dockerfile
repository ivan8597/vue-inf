# Этап сборки фронтенда
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Этап сборки бэкенда
FROM python:3.12-slim as backend-build
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Финальный этап
FROM nginx:stable-alpine
# Копируем собранный фронтенд
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем бэкенд
COPY --from=backend-build /app/backend /app/backend

# Устанавливаем Python и зависимости
RUN apk add --no-cache \
    python3 \
    py3-pip \
    postgresql-libs && \
    python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir psycopg2-binary && \
    /venv/bin/pip install -r /app/backend/requirements.txt

# Открываем порты
EXPOSE 80 8000

# Создаем скрипт для запуска сервисов
COPY <<EOF /start.sh
#!/bin/sh
nginx
cd /app/backend && /venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
EOF

RUN chmod +x /start.sh

# Запускаем сервисы
CMD ["/start.sh"] 