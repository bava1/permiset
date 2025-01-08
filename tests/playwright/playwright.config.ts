import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
import { join } from 'path';
dotenv.config({ path: join(__dirname, '.env') });

export default defineConfig({
  testDir: './tests', 
  timeout: 10 * 1000, 
  retries: 1,
  workers: 2,
  reporter: 'html', 
  fullyParallel: true,
  use: {
    //baseURL: 'http://localhost:3000', 
    // headless: true,                  
    screenshot: 'only-on-failure',   
    // video: 'retain-on-failure',      
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /*
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
    */
  ],
});
