import { test, expect } from '@playwright/test';
import { LOGIN_SUCCESS } from './setup/script.setup';
import LoginPage from './pages/LoginPage';

test.describe('Purchase E2E Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        await page.route("**/api/auth/login", route => route.fulfill(LOGIN_SUCCESS));

        loginPage = new LoginPage(page);
    });

    // Test login
    test('Test Login', async ({ page }) => {
        await loginPage.goToLoginPage();
        await loginPage.handleLogin("nguyennamduong@gmail.com", "homnaythemgaran");

        // TEST EXPECT AFTER LOGIN
        await expect(page).toHaveURL("/");

        // TEST CART_SHOP ITEM  
        const auth = await page.evaluate(() => localStorage.getItem("CART_SHOP"));
        expect(auth).not.toBeNull();
    });


});