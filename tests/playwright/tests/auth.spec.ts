import { test, expect, BrowserContext, Page } from '@playwright/test';

test.describe('PermiSET Auth', () => {
    let context: BrowserContext;
    let page: Page;
    const clientURL = process.env.BASE_URL_CLIENT || '';
    let authData = {
        userEmail: 'administrator@test.com',
        userPassword: '123456'
    };

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        await context.clearCookies();
        page = await context.newPage();
        await page.goto(`${clientURL}/auth/login`);
        await page.waitForTimeout(2000);
        // Authorization
        await page.getByLabel('Email').fill(authData.userEmail);
        await page.getByLabel('Password').fill(authData.userPassword);
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('test LogIn', async () => {
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL(`${clientURL}`);
    });

    test('test LogOut', async () => {
        await page.getByLabel('User Options').click();
        await page.getByRole('menuitem', { name: 'Logout' }).click();
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL(`${clientURL}/auth/login`);
    });

});



