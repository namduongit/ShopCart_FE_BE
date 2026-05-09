import { expect, test } from '@playwright/test';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import { ProductPage } from './pages/ProductPage';

const bootStrapMockResponse = (statusCode: number, data: any) => {
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

const bootStrapMockResponseWithErrors = (statusCode: number, errors: any, data: any) => {
    return {
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify({
            "status": statusCode,
            "success": statusCode < 400,
            "message": statusCode < 400 ? "Success" : "Bad request",
            "errors": errors,
            "data": data
        })
    }
}

const SPECIFIC_PRODUCT_1 = {
    "id": 1,
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
        "id": 1,
        "stockQuantity": 30,
        "availableQuantity": 15
    }
}

const ADD_CART = {
    id: 1,
    quantity: 1,
    total: SPECIFIC_PRODUCT_1.price,
    product: {
        id: SPECIFIC_PRODUCT_1.id,
        mainImageUrl: SPECIFIC_PRODUCT_1.mainImageUrl,
        name: SPECIFIC_PRODUCT_1.name,
        price: SPECIFIC_PRODUCT_1.price,
        status: SPECIFIC_PRODUCT_1.status
    }
}

const ADD_CART_10 = {
    id: 1,
    quantity: 10,
    total: SPECIFIC_PRODUCT_1.price,
    product: {
        id: SPECIFIC_PRODUCT_1.id,
        mainImageUrl: SPECIFIC_PRODUCT_1.mainImageUrl,
        name: SPECIFIC_PRODUCT_1.name,
        price: SPECIFIC_PRODUCT_1.price,
        status: SPECIFIC_PRODUCT_1.status
    }
}

const CART: any[] = [];
const CART_AFTER_ADD = [ADD_CART];

test.describe('Cart E2E tests', () => {

    let productDetailPage: ProductDetailPage;
    let cartPage: CartPage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        await page.route('**/api/products/', route => route.fulfill(
            bootStrapMockResponse(200, [SPECIFIC_PRODUCT_1])
        ));

        await page.route('**/api/products/1', route => route.fulfill(
            bootStrapMockResponse(200, SPECIFIC_PRODUCT_1)
        ));

        let cartFetchCount = 0;
        await page.route('**/api/carts/', route => {
            cartFetchCount++;
            route.fulfill(bootStrapMockResponse(200, cartFetchCount === 1 ? CART : CART_AFTER_ADD));
        });

        
        

        productDetailPage = new ProductDetailPage(page);
        cartPage = new CartPage(page);
        productPage = new ProductPage(page);
    });


    test('Them san pham vao gio hang - add to cart flow', async ({ page }) => {
        await page.route('**/api/carts/add', route => {
            route.fulfill(bootStrapMockResponse(200, ADD_CART))
        });

        await productPage.goToProductPage();
        await productPage.clickDemoProduct();
        await productDetailPage.addToCart();

        await expect(page.locator('.toast-component')).toBeVisible();
        await expect(page.locator('.toast-component__message')).toContainText('đã được thêm vào giỏ hàng');
    });



    test('Validation message khi so luong san pham vuot ton kho', async ({ page }) => {
        let cartAddCount = 0;
        await page.route('**/api/carts/add', route => {
            cartAddCount++;
            if (cartAddCount === 1) {
                route.fulfill(bootStrapMockResponse(200, ADD_CART_10));
            } else {
                route.fulfill(bootStrapMockResponseWithErrors(400, 'Số lượng khả dụng còn lại không đủ (5) sản phẩm', ADD_CART_10));
            }
        });

        await productPage.goToProductPage();
        await productPage.clickDemoProduct();
        await productDetailPage.increaseQuantity(10);
        await productDetailPage.addToCart();
        await productDetailPage.addToCart();

        const errorToast = page.locator('.toast-component').filter({
            hasText: 'Số lượng khả dụng còn lại không đủ'
        });

        await expect(errorToast).toBeVisible();
        await expect(errorToast.getByTestId('toast-component__type')).toContainText('Thất bại');
    });
});
