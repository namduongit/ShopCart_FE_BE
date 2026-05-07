import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passworInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#email');
        this.passworInput = page.locator('#password');
        this.submitButton = page.locator('#login-submit');
    }

    async goToLoginPage() {
        await this.page.goto('/page/login');
    }

    async handleLogin(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passworInput.fill(password);
        await this.submitButton.click();
    }
}

export default LoginPage;