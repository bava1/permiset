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

  test('Permiset API login and get token', async () => {
    expect(token).toBeDefined();
  });

  test('Permiset API get users 1', async () => {
    const protectedResponse = await request.get(`${apiURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(protectedResponse.ok()).toBeTruthy();

    const usersData = await protectedResponse.json();
    console.log('Users data1 length:', usersData.length);
    expect(usersData.length).toBeGreaterThan(0);
  });

  test('Permiset API cteate users', async () => {
    const response2 = await request.post(`${apiURL}/users`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
       },
      data: {
          "name": "Boh 3",
          "email": "test@test.com",
          "password": "123456",
          "role": "Administrator",
          "status": "active"
      },
    });

    expect(response2.ok()).toBeTruthy();

    const respon = await response2.json();

  });

  test('Permiset API get users 2', async () => {
    const protectedResponse = await request.get(`${apiURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(protectedResponse.ok()).toBeTruthy();

    const usersData = await protectedResponse.json();
    console.log('Users data2 length:', usersData.length);
    expect(usersData.length).toBeGreaterThan(0);
  });
});

