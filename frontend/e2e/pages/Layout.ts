import { Locator, Page } from "@playwright/test";

export class Layout {
    readonly page: Page;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.locator("#cart-badge");
    }
}