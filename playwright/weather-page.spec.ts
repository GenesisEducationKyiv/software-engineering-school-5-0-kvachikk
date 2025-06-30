import path from 'node:path';

import { test, expect } from '@playwright/test';

const fileUrl = (filePath: string) => 'file://' + path.resolve(__dirname, '..', filePath);

test.describe('Weather Page', () => {
   test.beforeEach(async ({ page }) => {
      // Route current weather API requests used by the frontend (see public/app.js constants)
      await page.route('**/weather/current*', async (route) => {
         const url = new URL(route.request().url());
         const city = url.searchParams.get('city');
         if (!city) {
            return route.fulfill({ status: 400, body: JSON.stringify({}) });
         }
         const fixture = {
            temperature: 20,
            humidity: 60,
            description: 'Sunny',
         };
         return route.fulfill({ status: 200, body: JSON.stringify(fixture) });
      });

      // Route subscription API requests
      await page.route('**/subscribe', async (route) => {
         const postData = await route.request().postDataJSON();
         if (!postData.email || !postData.city) {
            return route.fulfill({ status: 400, body: JSON.stringify({ message: 'Invalid' }) });
         }
         return route.fulfill({ status: 201, body: JSON.stringify({ message: 'Subscription created.' }) });
      });

      await page.goto(fileUrl('public/index.html'));
   });

   test('displays validation error when Get Weather clicked with empty input', async ({ page }) => {
      await page.getByText('Get Weather').click();
      const errorBox = page.locator('#searchWeatherMessage');
      await expect(errorBox).toBeVisible();
      await expect(errorBox).toContainText('Please enter a city name');
   });

   test('shows weather card after successful fetch', async ({ page }) => {
      await page.fill('#cityInput', 'Kyiv');
      await page.getByText('Get Weather').click();

      const card = page.locator('#searchWeatherResultCardWrapper .weather-card-item');
      await expect(card).toBeVisible();
      await expect(card).toContainText('Kyiv');
      await expect(card).toContainText('20');
   });

   test('subscription form success flow', async ({ page }) => {
      await page.fill('#emailInput', 'demo@example.com');
      await page.fill('#citySubInput', 'Kyiv');
      await page.selectOption('#frequencyInput', 'hourly');
      await page.locator('#subscribeBtn').click();

      const msg = page.locator('#subscriptionMessage');
      await expect(msg).toBeVisible();
      await expect(msg).toContainText('Subscription created');
   });
});
