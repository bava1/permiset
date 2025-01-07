import { test, expect, BrowserContext, Page } from '@playwright/test';

test.describe('GMP Navigation', () => {
    let context: BrowserContext;
    let page: Page;
    let url: string = 'https://permiset-client-1.vercel.app/auth/login' || '';
    let authData = {
        userEmail: 'administrator@test.com',
        userPassword: '123456'
    };

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        await context.clearCookies();
        page = await context.newPage();
        await page.goto('https://permiset-client-1.vercel.app/auth/login');
        await page.waitForTimeout(2000);
        // Authorization
        await page.getByLabel('Email').fill(authData.userEmail);
        await page.getByLabel('Password').fill(authData.userPassword);
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Go to PermiSET navigation 1', async () => {
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL(`https://permiset-client-1.vercel.app`);
    });

    test('Go to PermiSET navigation 2', async () => {
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Issues' }).click();
        await expect(page).toHaveURL(`https://permiset-client-1.vercel.app/issues`);
        await page.getByRole('button', { name: 'Blog' }).click();
        await expect(page).toHaveURL(`https://permiset-client-1.vercel.app/blog`);
        await page.getByRole('button', { name: 'Users' }).click();
        await expect(page).toHaveURL(`https://permiset-client-1.vercel.app/users`);
        await page.getByRole('button', { name: 'Logs' }).click();
        await expect(page).toHaveURL(`https://permiset-client-1.vercel.app/logs`);
    });

    test('Go to PermiSET navigation 3', async () => {
        await page.getByRole('button', { name: 'Home' }).click();
        await expect(page).toHaveURL(`https://permiset-client-1.vercel.app`);
    });
});


/*
test('Go to PermiSET navigation', async ({ page }) => {
    await page.getByRole('button', { name: 'Issues' }).click();
    await expect(page).toHaveURL(`https://permiset-client-1.vercel.app/issues`);
});
*/


/*
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
*/

