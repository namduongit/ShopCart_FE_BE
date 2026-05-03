import { test } from '@playwright/test';


test.describe('Cart E2E tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/page/login');

        // todo: need to fill in test account later when database is set up
        await page.getByTestId('email-input').fill('test@example.com');
        await page.getByTestId('password-input').fill('password123');
        await page.getByTestId('login-btn').click();

        await page.waitForURL('/page/product');
    });


    test('Them san pham vao gio hang - add to cart flow', async ({ page }) => {
        
    });



    test('Validation message khi so luong san pham vuot ton kho', async ({ page }) => {

    });
});
