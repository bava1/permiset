# Базовый образ
FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm@8.8.0

# Копируем корневой pnpm-lock.yaml и package.json сервера
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY apps/server/package.json ./package.json

# Устанавливаем зависимости для сервера
RUN pnpm install --no-frozen-lockfile

# Компиляция TypeScript
COPY apps/server/ .
RUN pnpm exec tsc

# ================== Production Stage ==================
FROM node:18-alpine AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm@8.8.0

# Копируем собранный код и зависимости
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY apps/server/package.json ./package.json

# Открываем порт для сервера
EXPOSE 3000

# Запускаем сервер
CMD ["node", "dist/index.js"]
