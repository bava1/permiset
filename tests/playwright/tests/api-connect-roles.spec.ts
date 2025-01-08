import { test, expect, APIRequestContext } from '@playwright/test';

test.describe('Permiset API', () => {
  let request: APIRequestContext;
  let token: string;
  const apiURL = process.env.BASE_URL_SERVER || 'https://permiset-server-8-latest.onrender.com';

  test.beforeAll(async ({ playwright }) => {
    // Увеличиваем таймаут для блока beforeAll
    test.setTimeout(5000); // 30 секунд

    request = await playwright.request.newContext({
      ignoreHTTPSErrors: true,
    });

    const response = await request.post(`${apiURL}/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: 'administrator@test.com',
        password: '123456',
      },
    });

    expect(response.ok()).toBeTruthy();

    const responseData = await response.json();
    token = responseData.token;
    expect(token).toBeDefined();
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('login and get token', async () => {
    expect(token).toBeDefined();
    console.log('Users token:', token);
  });

  test('get roles list 1', async () => {
    const protectedResponse = await request.get(`${apiURL}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(protectedResponse.ok()).toBeTruthy();

    const usersData = await protectedResponse.json();
    console.log('Roles data1 length:', usersData.length);
    expect(usersData.length).toBeGreaterThan(0);
  });

  test.skip('cteate role', async () => {
    const response2 = await request.post(`${apiURL}/roles`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
      data: {
        "name": "Tester",
        "permissions": [
          "read", 
          "update"
        ]
      },
    });
  });

  test.skip('get roles list 2', async () => {
    const protectedResponse = await request.get(`${apiURL}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(protectedResponse.ok()).toBeTruthy();

    const usersData = await protectedResponse.json();
    console.log('Roles data2 length:', usersData.length);
    console.log('Roles data list:', usersData);
    expect(usersData.length).toBeGreaterThan(0);
  });
});

