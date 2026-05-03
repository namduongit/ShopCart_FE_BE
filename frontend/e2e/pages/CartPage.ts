import { Locator, Page } from "@playwright/test";


export default class CartPage {
    readonly page: Page;

    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cartBadge = page.getByTestId('cart-badge');
    }

    async gotoProductsPage() {
        await this.page.goto('/page/product');
    }

    async addProductToCart() {

    }


}