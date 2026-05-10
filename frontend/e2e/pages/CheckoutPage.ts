import { Locator, Page } from "@playwright/test";

export default class CheckoutPage {
    readonly page: Page;

    readonly fullNameInput: Locator;
    readonly phoneInput: Locator;
    readonly addressInput: Locator;

    readonly couponInput: Locator;
    readonly applyCouponButton: Locator;

    readonly submitButton: Locator;

    readonly totalDisplay: Locator;

    constructor(page: Page) {
        this.page = page;
        this.fullNameInput = page.locator('#fullName');
        this.phoneInput = page.locator('#phone');
        this.addressInput = page.locator('#address');

        this.couponInput = page.locator('#coupon');
        this.applyCouponButton = page.locator('#apply-coupon-button');

        this.submitButton = page.locator('#checkout-submit');

        this.totalDisplay = page.getByTestId('subtotal-display');
    }

    async goToCheckoutPage() {
        await this.page.goto('/page/checkout')
    }

    async fillCheckoutForm(phoneNumber: string, address: string, fullName?: string) {
        await this.phoneInput.fill(phoneNumber);
        await this.addressInput.fill(address);
        await this.fullNameInput.fill(fullName || "");
    }

    async fillCoupon(code: string) {
        await this.couponInput.fill(code);
    }

    async applyCoupon() {
        await this.applyCouponButton.click();
    }

    async makePurchase() {
        await this.submitButton.click();
    }
}
