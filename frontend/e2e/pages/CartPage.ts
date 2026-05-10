import { Locator, Page } from "@playwright/test";


export default class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoCartPage() {
        await this.page.goto('/page/cart');
    }
}