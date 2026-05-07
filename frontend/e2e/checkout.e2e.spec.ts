import { test, expect } from '@playwright/test';
import { ADD_CART, CHECK_STOCK, CLEAR_CART, GET_OWNER_CARTS, GET_OWNER_CARTS_AFTER_ADD, GET_SPECIFIC_PURCHASE, MAKE_PURCHARSE, SPECIFIC_PRODUCT } from './setup/script.setup';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { Layout } from './pages/Layout';

test.describe('Purchase E2E Tests', () => {
    let cartFetchCount = 0;

    let layout: Layout;
    let productDetailPage: ProductDetailPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        // Current 2 product
        await page.route("**/api/carts/", route => {
            cartFetchCount++;
            if (cartFetchCount == 1) {
                route.fulfill(GET_OWNER_CARTS);
            } else {
                route.fulfill(GET_OWNER_CARTS_AFTER_ADD);
            }
        });
        await page.route("**/api/products/2", route => route.fulfill(SPECIFIC_PRODUCT));
        await page.route("**/api/carts/add", route => route.fulfill(ADD_CART));

        await page.route("**/api/inventories/checkStock", router => router.fulfill(CHECK_STOCK));
        await page.route("**/api/purchases/", route => {
            if (route.request().method() === 'POST') {
                route.fulfill(MAKE_PURCHARSE);
            } else {
                route.continue();
            }
        });

        await page.route("**/api/carts/clear", router => router.fulfill(CLEAR_CART));

        await page.route("**/api/purchases/3", route => route.fulfill(GET_SPECIFIC_PURCHASE));

        layout = new Layout(page);
        productDetailPage = new ProductDetailPage(page);
        checkoutPage = new CheckoutPage(page);
    });

    test('Complete Checkout Flow', async ({ page }) => {
        await productDetailPage.goToProductDetailPage(2);
        await productDetailPage.addToCart();

        await expect(page.locator('.toast-component')).toBeVisible();
        await expect(page.locator('.toast-component__message')).toContainText('đã được thêm vào giỏ hàng');
        await expect(layout.cartBadge).toContainText('3'); // 2 + 1 = 3

        await checkoutPage.goToCheckoutPage();

        await expect(checkoutPage.applyCouponButton).toBeDisabled();

        await checkoutPage.fillCheckoutForm("0388853835", "273 An Dương Vương", "Nguyễn Nam Dương");
        await checkoutPage.makePurchase();

        await expect(checkoutPage.page.locator('.toast-component')).toBeVisible();
        await expect(checkoutPage.page.locator('.toast-component__message')).toContainText('đã được tạo');
        await expect(page).toHaveURL("/page/orders/3");
        await expect(layout.cartBadge).not.toBeAttached();
        await expect(page.locator('#payment-status')).toContainText('Chờ thanh toán');
    });
});