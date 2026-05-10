import { describe, expect, test } from "vitest";
import { validateCartItem, calculateCartTotal } from "./cart.utils";
import type { CartDto } from "../../libs/dto/CartDto";

describe("Cart Utils Tests", () => {
    describe("Feature: validateCartItem()", () => {
        test("Test quantity rỗng / null / undefined", () => {
            expect(validateCartItem(null, 10)).toEqual({ isValid: false, message: "Quantity is required" });
            expect(validateCartItem(undefined, 10)).toEqual({ isValid: false, message: "Quantity is required" });
            expect(validateCartItem(NaN, 10)).toEqual({ isValid: false, message: "Quantity is required" });
        });

        test("Test quantity âm hoặc bằng 0", () => {
            expect(validateCartItem(0, 10)).toEqual({ isValid: false, message: "Quantity must be greater than 0" });
            expect(validateCartItem(-5, 10)).toEqual({ isValid: false, message: "Quantity must be greater than 0" });
        });

        test("Test quantity vượt quá tồn kho", () => {
            expect(validateCartItem(15, 10)).toEqual({ isValid: false, message: "Quantity exceeds stock" });
        });

        test("Test quantity hợp lệ", () => {
            expect(validateCartItem(5, 10)).toEqual({ isValid: true, message: "Valid" });
            expect(validateCartItem(10, 10)).toEqual({ isValid: true, message: "Valid" });
        });
    });

    describe("Feature: calculateCartTotal()", () => {
        const mockCartItems: CartDto[] = [
            {
                id: 1,
                quantity: 2,
                total: 200,
                product: {
                    id: 101,
                    name: "Product 1",
                    price: 100,
                    mainImageUrl: "",
                    status: "ACTIVE"
                }
            },
            {
                id: 2,
                quantity: 1,
                total: 150,
                product: {
                    id: 102,
                    name: "Product 2",
                    price: 150,
                    mainImageUrl: "",
                    status: "ACTIVE"
                }
            }
        ];

        test("Test giỏ hàng rỗng", () => {
            expect(calculateCartTotal([])).toBe(0);
        });

        test("Test tính tổng giá đúng với nhiều sản phẩm", () => {
            expect(calculateCartTotal(mockCartItems)).toBe(350);
        });

        test("Test áp dụng mã giảm giá", () => {
            expect(calculateCartTotal(mockCartItems, "DISCOUNT10")).toBe(315);
            expect(calculateCartTotal(mockCartItems, "DISCOUNT20")).toBe(280);
        });

        test("Test tổng giá sau khi xóa sản phẩm", () => {
            const remainingItems = mockCartItems.filter(item => item.id !== 1);
            expect(calculateCartTotal(remainingItems)).toBe(150);
        });
    });
});
