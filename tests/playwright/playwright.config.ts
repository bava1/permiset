import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Каталог, где находятся ваши тесты
  timeout: 30 * 1000, // Тайм-аут на каждый тест
  retries: 1,         // Повтор тестов при ошибках
  use: {
    //baseURL: 'http://localhost:3000', // URL сервера
    headless: true,                  // Запуск без интерфейса
    screenshot: 'only-on-failure',   // Скриншоты только при ошибках
    video: 'retain-on-failure',      // Видеозапись только при ошибках
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});
