import { expect, Page, test as setup } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { LOGIN_SUCCESS } from './script.setup';

setup('authentication', async ({ page }: { page: Page }) => {
    await page.route("/api/auth/login", route => route.fulfill(LOGIN_SUCCESS));

    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.handleLogin("nguyennamduong@gmail.com", "ThemGaRan");

    await expect(page.locator(".toast-component")).toBeVisible();
    await expect(page.locator(".toast-component__message")).toContainText("Đăng nhập thành công");
    await expect(page).toHaveURL("/");

    await page.context().storageState({ path: 'e2e/resource/State_Auth.json' });
});