import { Locator, Page } from "@playwright/test";

export class ProductDetailPage {
    readonly page: Page;
    readonly addButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.addButton = page.locator("#add-button");
    }

    async goto(id: number) {
        await this.page.goto(`/page/product/${id}`);
    }

    async add() {
        await this.addButton.click();
    }
}

export default ProductDetailPage;