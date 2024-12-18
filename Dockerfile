# Базовый образ для зависимостей
FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm@8.8.0

# Копируем lock-файлы и package.json для всех workspaces
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Устанавливаем все зависимости для всех workspaces
RUN pnpm install --frozen-lockfile

# ================= CLIENT ====================
FROM base AS client-build

# Переходим в директорию клиента
WORKDIR /app/apps/client

# Копируем исходный код клиента
COPY apps/client ./

# Копируем public-ресурсы клиента (изображения и статические файлы)
COPY apps/client/public ./public

# Собираем Next.js
RUN pnpm build

# ================= SERVER ====================
FROM base AS server-build

# Переходим в директорию сервера
WORKDIR /app/apps/server

# Копируем исходный код сервера
COPY apps/server ./

# Компилируем TypeScript
RUN pnpm build

# ================= PRODUCTION ====================
FROM node:18-alpine AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm@8.8.0

# Копируем собранные артефакты клиента и сервера
COPY --from=client-build /app/apps/client/.next ./apps/client/.next
COPY --from=client-build /app/apps/client/public ./apps/client/public
COPY --from=server-build /app/apps/server/dist ./apps/server/dist

# Копируем package.json и lock-файлы
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/package.json
COPY apps/client/package.json ./apps/client/package.json

# Устанавливаем production-зависимости
RUN pnpm install --frozen-lockfile --prod

# Открываем порт 3000
EXPOSE 3000

# Запускаем сервер Express, который будет обслуживать клиент Next.js и API
CMD ["node", "apps/server/dist/index.js"]
