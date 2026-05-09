import { test, expect } from '@playwright/test';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { Layout } from './pages/Layout';

const CART_BEFORE_ADD = [
    {
        "id": 19,
        "quantity": 1,
        "total": 1590000.00,
        "product": {
            "id": 21,
            "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
            "name": "Logitech MX Master 3S",
            "price": 1590000.00,
            "status": "ACTIVE"
        }
    }
];
const SPECIFIC_PRODUCT_2 = {
    "id": 2,
    "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
    "imageUrls": [
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__9.png",
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_4__9.png",
        "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_5__11_2.png"
    ],
    "name": "Apple MacBook Pro 14 inch M3 Pro",
    "description": "apple-macbook-pro-14-m3-pro",
    "slug": "MacBook Pro 14 inch chip M3 Pro - hiệu năng vượt trội, thời lượng pin cả ngày, màn hình Liquid Retina XDR.",
    "attributes": {
        "Pin": "70 Whr, lên đến 18 giờ sử dụng",
        "RAM": "18 GB Unified Memory",
        "Chip": "Apple M3 Pro (11-core CPU, 14-core GPU)",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Camera": "1080p FaceTime HD",
        "Bluetooth": "Bluetooth 5.3",
        "Bàn phím": "Magic Keyboard với Touch ID",
        "Màn hình": "14.2 inch Liquid Retina XDR, 3024x1964, ProMotion 120Hz",
        "Màu sắc": "Space Black",
        "Ổ cứng": "512 GB SSD",
        "Bảo hành": "12 tháng Apple",
        "Trọng lượng": "1.61 kg",
        "Cổng kết nối": "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3",
        "Hệ điều hành": "macOS Sonoma"
    },
    "price": 52990000.00,
    "status": "ACTIVE",
    "inventory": {
        "id": 2,
        "stockQuantity": 30,
        "availableQuantity": 9
    }
}

const ADD_CART = {
    id: Date.now(),
    quantity: 1,
    total: SPECIFIC_PRODUCT_2.price * 1,
    product: {
        id: SPECIFIC_PRODUCT_2.id,
        mainImageUrl: SPECIFIC_PRODUCT_2.mainImageUrl,
        name: SPECIFIC_PRODUCT_2.name,
        price: SPECIFIC_PRODUCT_2.price,
        status: SPECIFIC_PRODUCT_2.status
    }
}

const CART_AFTER_ADD = [
    ...CART_BEFORE_ADD,
    {
        id: Date.now(),
        quantity: 1,
        total: SPECIFIC_PRODUCT_2.price * 1,
        product: {
            id: SPECIFIC_PRODUCT_2.id,
            mainImageUrl: SPECIFIC_PRODUCT_2.mainImageUrl,
            name: SPECIFIC_PRODUCT_2.name,
            price: SPECIFIC_PRODUCT_2.price,
            status: SPECIFIC_PRODUCT_2.status
        }
    }
];
const CHECK_STOCK = true;
const CHECK_COUPON = {
    id: Date.now(),
    name: "GIAMGIAVIP",
    value: 200000,
    status: "ACTIVE",
    expiryDate: Date.now(),
    minimumPurchaseAmount: 1000000,
    isValid: true
}

const calcTotalAmount = (): number => {
    return CART_AFTER_ADD.reduce((total, cart) => total + cart.quantity * cart.product.price, 0);
}

const calcShippingFee = (): number => {
    return calcTotalAmount() >= 10000000 ? 0 : 50000;
}

const calcTotalCartQuantity = (): number => {
    return CART_AFTER_ADD.reduce((total, cart) => total + cart.quantity, 0);
}

const MAKE_PURCHASE = {
    "id": 3,
    "fullName": "Nguyễn Nam Dương",
    "address": "273 An Dương Vương",
    "status": "PENDING",
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "totalAmount": calcTotalAmount() + calcShippingFee() - CHECK_COUPON.value,
    "shippingFee": calcShippingFee(),
    "totalQuantity": calcTotalCartQuantity(),
    "user": {
        "id": 2,
        "fullName": "Nguyễn Nam Dương",
        "email": "nguyennamduong001@gmail.com"
    },
    "items": CART_AFTER_ADD.map(cart => ({
        "id": Date.now(),
        "product": {
            "id": cart.product.id,
            "mainImageUrl": cart.product.mainImageUrl,
            "name": cart.product.name,
            "price": cart.product.price,
            "status": cart.product.status
        },
        "quantity": cart.quantity,
        "total": cart.quantity * cart.product.price
    })),
    "coupon": {
        "id": CHECK_COUPON.id,
        "name": CHECK_COUPON.name,
        "value": CHECK_COUPON.value
    }
};
const CART_AFTER_MAKE_PURCHASE = null;
const SPECIFIC_PURCHASE_3 = MAKE_PURCHASE;

export const bootStrapMockResponse = (statusCode: number, data: any) => {
    return {
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify({
            "status": statusCode,
            "success": statusCode < 400,
            "message": statusCode < 400 ? "Success" : "Bad request",
            "errors": null,
            "data": data
        })
    }
}

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        p,
    );

test.describe('Purchase E2E Tests', () => {
    let cartFetchCount = 0;

    let layout: Layout;
    let productDetailPage: ProductDetailPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        // Current 2 product
        cartFetchCount = 0;
        await page.route("**/api/carts/", route => {
            cartFetchCount++;
            if (cartFetchCount == 1) {
                route.fulfill(bootStrapMockResponse(200, CART_BEFORE_ADD));
            } else {
                route.fulfill(bootStrapMockResponse(200, CART_AFTER_ADD));
            }
        });
        await page.route("**/api/products/2", route => route.fulfill(bootStrapMockResponse(200, SPECIFIC_PRODUCT_2)));
        await page.route("**/api/carts/add", route => route.fulfill(bootStrapMockResponse(200, ADD_CART)));
        await page.route("**/api/inventories/checkStock", router => router.fulfill(bootStrapMockResponse(200, CHECK_STOCK)));
        await page.route("**/api/coupons/check", route => route.fulfill(bootStrapMockResponse(200, CHECK_COUPON)));
        await page.route("**/api/purchases/", route => route.fulfill(bootStrapMockResponse(200, MAKE_PURCHASE)));
        await page.route("**/api/carts/clear", router => router.fulfill(bootStrapMockResponse(200, CART_AFTER_MAKE_PURCHASE)));
        await page.route("**/api/purchases/3", route => route.fulfill(bootStrapMockResponse(200, SPECIFIC_PURCHASE_3)));

        layout = new Layout(page);
        productDetailPage = new ProductDetailPage(page);
        checkoutPage = new CheckoutPage(page);
    });

    test('Complete Checkout Flow', async ({ page }) => {
        page.on('request', req => {
            if (req.url().includes('product')) {
                console.log('REQUEST:', req.url());
            }
        });
        page.on('response', res => {
            if (res.url().includes('product')) {
                console.log('RESPONSE:', res.url(), res.status());
            }
        });

        await productDetailPage.goToProductDetailPage(2);
        await productDetailPage.addToCart();

        await expect(page.locator('.toast-component')).toBeVisible();
        await expect(page.locator('.toast-component__message')).toContainText('đã được thêm vào giỏ hàng');
        // Cart badge after add
        await expect(layout.cartBadge).toContainText(calcTotalCartQuantity().toString());

        await checkoutPage.goToCheckoutPage();
        // Calc total amount before add coupon
        await expect(checkoutPage.totalDisplay).toContainText(fmtPrice(calcTotalAmount() + calcShippingFee()));
        // Coupon button is disabled
        await expect(checkoutPage.applyCouponButton).toBeDisabled();
        // Fill data into coupon field
        await checkoutPage.fillCoupon(CHECK_COUPON.name);
        await checkoutPage.applyCoupon();
        await expect(checkoutPage.page.locator('.toast-component__message').filter({
            hasText: `Mã "${CHECK_COUPON.name}" giảm`,
        })).toBeVisible();

        // Calc before add coupon
        await expect(checkoutPage.totalDisplay).toContainText(fmtPrice(calcTotalAmount() + calcShippingFee() - CHECK_COUPON.value));

        await checkoutPage.fillCheckoutForm("0388853835", "273 An Dương Vương", "Nguyễn Nam Dương");
        await checkoutPage.makePurchase();

        await expect(checkoutPage.page.locator('.toast-component__message').filter({
            hasText: 'đã được tạo',
        })).toBeVisible();
        await expect(page).toHaveURL("/page/orders/3");
        await expect(layout.cartBadge).not.toBeAttached();
        await expect(page.locator('#payment-status')).toContainText('Chờ thanh toán');
    });
});
