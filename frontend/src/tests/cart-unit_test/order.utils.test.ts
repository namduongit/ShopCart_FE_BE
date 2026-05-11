import { describe, expect, test } from "vitest";
import { calculateOrderPrice, checkInventoryAvailability, type CouponCustom } from "./order.utils";
import type { OrderItemProductDto } from "../../libs/dto/OrderItemProductDto";
import type { OrderItemDto } from "../../libs/dto/OrderItemDto";

const createMockProduct = (price: number): OrderItemProductDto => {
    const id = Date.now();
    return {
        id: id,
        mainImageUrl: "",
        name: `Product ${id}`,
        price: price,
        status: "ACTIVE"
    }
}

describe("Order Utils Tests (Price Calculation & Inventory)", () => {
    const mockProduct: OrderItemProductDto[] = [
        createMockProduct(100),
        createMockProduct(200),
        createMockProduct(300),
    ];

    describe("a) calculateOrderPrice()", () => {
        const mockItems: OrderItemDto[] = [
            {
                id: Date.now(),
                product: mockProduct[0],
                quantity: 1,
                total: mockProduct[0].price * 1
            },
            {
                id: Date.now(),
                product: mockProduct[1],
                quantity: 1,
                total: mockProduct[1].price * 1
            }
        ];

        const totalPriceMock = mockItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

        test("Test tính tổng giá trước giảm giá (subtotal)", () => {
            const result = calculateOrderPrice(mockItems);

            expect(result.subtotal).toBe(mockItems.reduce((total, item) => total + item.product.price * item.quantity, 0));
            expect(result.discount).toBe(0);
            expect(result.total).toBe(mockItems.reduce((total, item) => total + item.product.price * item.quantity, 0));
        });

        test("Test áp dụng coupon giảm % (ví dụ: 10%, 20%)", () => {
            const totalDiscountMock = (value: number) => Math.ceil(totalPriceMock * (value / 100));

            const coupon1: CouponCustom = { code: "", type: 'PER', value: 10 };
            const result1 = calculateOrderPrice(mockItems, coupon1);

            expect(result1.discount).toBe(totalDiscountMock(coupon1.value));
            expect(result1.total).toBe(totalPriceMock - totalDiscountMock(coupon1.value));

            const coupon2: CouponCustom = { code: "", type: 'PER', value: 20 };

            const result2 = calculateOrderPrice(mockItems, coupon2);
            expect(result2.discount).toBe(totalDiscountMock(coupon2.value));
            expect(result2.total).toBe(totalPriceMock - totalDiscountMock(coupon2.value));

        });

        test("Test áp dụng coupon giảm số tiền cố định", () => {
            const totalDiscount = (value: number) => value;

            const coupon: CouponCustom = { code: "", type: 'FIXED', value: 10 };
            const result = calculateOrderPrice(mockItems, coupon);
            expect(result.discount).toBe(totalDiscount(coupon.value));
            expect(result.total).toBe(totalPriceMock - totalDiscount(coupon.value));
        });

        test("Test tính phí vận chuyển", () => {
            const shippingFee = 30;
            const result = calculateOrderPrice(mockItems, undefined, shippingFee);
            expect(result.shipping).toBe(shippingFee);
            expect(result.total).toBe(totalPriceMock + shippingFee);
        });

        test("Test tổng cuối cùng (subtotal + shipping - discount)", () => {
            const coupon: CouponCustom = { code: "", type: 'FIXED', value: 10 };
            const shippingFee = 20; // +20
            const result = calculateOrderPrice(mockItems, coupon, shippingFee);

            expect(result.subtotal).toBe(totalPriceMock);
            expect(result.discount).toBe(coupon.value);
            expect(result.shipping).toBe(shippingFee);
            expect(result.total).toBe(totalPriceMock - coupon.value + shippingFee);
        });
    });

    describe("b) checkInventoryAvailability()", () => {
        test("Test tồn kho đủ (requested <= stock)", () => {
            expect(checkInventoryAvailability(5, 10)).toBe(true);
            expect(checkInventoryAvailability(10, 10)).toBe(true);
        });

        test("Test tồn kho thiếu (requested > stock)", () => {
            expect(checkInventoryAvailability(11, 10)).toBe(false);
        });

        test("Test số lượng không hợp lệ (<= 0)", () => {
            expect(checkInventoryAvailability(0, 10)).toBe(false);
            expect(checkInventoryAvailability(-1, 10)).toBe(false);
        });
    });
});
