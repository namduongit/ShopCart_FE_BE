import { Page, test as setup } from '@playwright/test';

setup('authentication', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:5173');

    await page.evaluate(() => {
        localStorage.setItem("CART_SHOP", JSON.stringify({
            "id": 2,
            "name": "Nguyễn Nam Dương",
            "email": "nguyennamduong@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uYW1kdW9uZzAwMUBnbWFpbC5jb20iLCJpZCI6MiwiZW1haWwiOiJuZ3V5ZW5uYW1kdW9uZzAwMUBnbWFpbC5jb20iLCJuYW1lIjoiTmd1eeG7hW4gTmFtIETGsMahbmciLCJpYXQiOjE3NzgxMzY5NDIsImV4cCI6MTc3ODIyMzM0Mn0.cUhpvTiXCnrtI7KT3A0nzxC85sdFbyyxCm-t14U5Lr8"
        }));
    });

    await page.context().storageState({ path: 'e2e/resource/State_Auth.json' });
});