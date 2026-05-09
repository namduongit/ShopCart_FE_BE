import { Locator, Page } from "@playwright/test";

export class ProductDetailPage {
    readonly page: Page;
    readonly addButton: Locator;
    readonly increaseButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.addButton = page.locator("#add-button");
        this.increaseButton = page.getByTestId('increase-qty-btn');
    }

    async goToProductDetailPage(id: number) {
        await this.page.goto(`/page/product/${id}`);
    }

    async addToCart() {
        await this.addButton.click();
    }

    async increaseQuantity(numberOfClicks: number) {
        for (let i=0; i<numberOfClicks; i++) {
            await this.increaseButton.click();
        }
    }
}

export default ProductDetailPage;