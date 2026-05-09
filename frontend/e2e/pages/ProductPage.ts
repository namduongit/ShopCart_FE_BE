import { Locator, Page } from "@playwright/test";


export class ProductPage {
    readonly page: Page;
    readonly demoProduct: Locator;

    constructor(page: Page) {
        this.page = page;
        this.demoProduct = page.getByTestId('demo-product').first();
    }

    async goToProductPage() {
        await this.page.goto('/page/product');
    }

    async clickDemoProduct() {
        await this.demoProduct.click();
    }
}