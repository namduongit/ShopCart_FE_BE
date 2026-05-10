import { describe, expect, test } from "vitest";
import { calculateOrderPrice, checkInventoryAvailability, type OrderItem, type Coupon } from "./order.utils";

describe("Order Utils Tests (Price Calculation & Inventory)", () => {
    
    describe("a) calculateOrderPrice()", () => {
        const mockItems: OrderItem[] = [
            { price: 100, quantity: 2 }, // 200
            { price: 50, quantity: 2 }   // 100
        ]; // Total subtotal = 300

        test("Test tính tổng giá trước giảm giá (subtotal)", () => {
            const result = calculateOrderPrice(mockItems);
            expect(result.subtotal).toBe(300);
            expect(result.discount).toBe(0);
            expect(result.total).toBe(300);
        });

        test("Test áp dụng coupon giảm % (ví dụ: 10%, 20%)", () => {
            const coupon10: Coupon = { type: 'PERCENTAGE', value: 10 };
            const result10 = calculateOrderPrice(mockItems, coupon10);
            expect(result10.discount).toBe(30); // 10% của 300
            expect(result10.total).toBe(270);

            const coupon20: Coupon = { type: 'PERCENTAGE', value: 20 };
            const result20 = calculateOrderPrice(mockItems, coupon20);
            expect(result20.discount).toBe(60); // 20% của 300
            expect(result20.total).toBe(240);
        });

        test("Test áp dụng coupon giảm số tiền cố định", () => {
            const couponFixed: Coupon = { type: 'FIXED', value: 50 };
            const result = calculateOrderPrice(mockItems, couponFixed);
            expect(result.discount).toBe(50);
            expect(result.total).toBe(250);
        });

        test("Test tính phí vận chuyển", () => {
            const shippingFee = 30;
            const result = calculateOrderPrice(mockItems, undefined, shippingFee);
            expect(result.shipping).toBe(30);
            expect(result.total).toBe(330); // 300 + 30
        });

        test("Test tổng cuối cùng (subtotal + shipping - discount)", () => {
            const coupon: Coupon = { type: 'PERCENTAGE', value: 10 }; // -30
            const shippingFee = 20; // +20
            const result = calculateOrderPrice(mockItems, coupon, shippingFee);
            
            // Subtotal: 300, Discount: 30, Shipping: 20
            // Total: 300 - 30 + 20 = 290
            expect(result.subtotal).toBe(300);
            expect(result.discount).toBe(30);
            expect(result.shipping).toBe(20);
            expect(result.total).toBe(290);
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
