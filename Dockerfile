# Стадия сборки
FROM node:18-alpine AS base

WORKDIR /app

# Установка необходимых инструментов для node-gyp
RUN apk add --no-cache python3 make g++

# Копируем зависимости из корня проекта
COPY package.json pnpm-lock.yaml ./

# Устанавливаем PNPM и зависимости
RUN npm install -g pnpm@8.8.0 && pnpm install --strict-peer-dependencies --include=dev

# Копируем только сервер
COPY apps/server ./server

# Переходим в папку сервера
WORKDIR /app/server

# Собираем TypeScript
RUN pnpm exec tsc -p tsconfig.json

# Финальная стадия
FROM node:18-alpine AS production

WORKDIR /app

# Копируем собранные файлы
COPY --from=base /app/server/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY apps/server/package.json ./package.json

# Открываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["node", "dist/index.js"]
