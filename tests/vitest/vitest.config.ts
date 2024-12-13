import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Подключаем глобальные функции Vitest
    environment: 'jsdom', // Используем jsdom для тестирования React
    include: ["**/*.test.{js,ts,jsx,tsx}"], // Указывает пути для поиска тестов
    exclude: ["node_modules", "dist"],
  },
});
