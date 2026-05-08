import { describe, test, vi, expect, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router";

import CheckoutPage from "../pages/checkout/checkout";
import { AuthContext } from "../contexts/auth-context";
import { CartContext } from "../contexts/cart-context";
import { NotificateContext } from "../contexts/notificate-context";
import InventoryService from "../services/InventoryService";
import OrderService from "../services/OrderService";
import CouponService from "../services/CouponService";

vi.mock("../services/InventoryService");
vi.mock("../services/OrderService");
vi.mock("../services/CouponService");

const cartItems = [
    {
        id: 1,
        quantity: 3,
        total: 137970000,
        product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000,
            status: "ACTIVE",
        },
    },
];

const mockAuthContext = {
    state: {
        id: 2,
        name: "Nguyen Van A",
        email: "nguyenvana@gmail.com",
        token: "fake-token",
    },
    isAuthenticated: true,
    saveState: vi.fn(),
    clearState: vi.fn(),
};

const mockCartContext = {
    cartItems,
    loading: false,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    clearCart: vi.fn().mockResolvedValue(undefined),
    fetchCart: vi.fn(),
};

const mockNotificationContext = {
    showToast: vi.fn(),
    showConfirmAlert: vi.fn(),
};

const renderCheckoutPage = () => {
    return render(
        <MemoryRouter>
            <AuthContext.Provider value={mockAuthContext}>
                <CartContext.Provider value={mockCartContext}>
                    <NotificateContext.Provider value={mockNotificationContext}>
                        <CheckoutPage />
                    </NotificateContext.Provider>
                </CartContext.Provider>
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe("Purchase Mock Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    test("Purchase: Dat hang thanh cong", async () => {
        vi.mocked(InventoryService.CheckStock).mockResolvedValue({
            status: 200,
            success: true,
            message: "Success",
            errors: null,
            data: true,
        });

        vi.mocked(OrderService.CreateOrder).mockResolvedValue({
            status: 201,
            success: true,
            message: "Created",
            errors: null,
            data: {
                id: 3,
            } as any,
        });

        renderCheckoutPage();

        fireEvent.change(screen.getByPlaceholderText('0987654321'), {
            target: { value: '0909888333' },
        });
        fireEvent.change(screen.getByPlaceholderText('Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành'), {
            target: { value: '123 abc' },
        });
        fireEvent.click(screen.getByRole("button", { name: /Đặt hàng/i }));

        await waitFor(() => {
            expect(InventoryService.CheckStock).toHaveBeenCalledWith({
                items: [{ productId: 1, quantity: 3 }],
            });
            expect(OrderService.CreateOrder).toHaveBeenCalledWith({
                fullName: "Nguyen Van A",
                phone: "0909888333",
                address: "123 abc",
                paymentMethod: "COD",
                couponCode: undefined,
                items: [{ productId: 1, quantity: 3 }],
            });
        });
    });

    test("Purchase: Dat hang that bai do khong du so luong", async () => {

        // arrange
        vi.mocked(InventoryService.CheckStock).mockResolvedValue({
            status: 200,
            success: true,
            message: "Success",
            errors: null,
            data: false,
        });

        // act
        renderCheckoutPage();

        fireEvent.change(screen.getByPlaceholderText('0987654321'), {
            target: { value: '0909888333' },
        });
        fireEvent.change(screen.getByPlaceholderText('Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành'), {
            target: { value: '123 abc' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Đặt hàng/i }));

        // assert
        await waitFor(() => {
            expect(InventoryService.CheckStock).toHaveBeenCalledWith({
                items: [{ productId: 1, quantity: 3 }],
            });
        });

        expect(OrderService.CreateOrder).not.toHaveBeenCalled();
    });

    

    test('Purchase: Dat hang thanh cong co ap dung coupon', async () => {

        // arrange
        vi.mocked(InventoryService.CheckStock).mockResolvedValue({
            status: 200,
            success: true,
            message: 'Success',
            errors: null,
            data: true
        });

        vi.mocked(CouponService.CheckCoupon).mockResolvedValue({
            status: 200,
            success: true,
            message: 'Success',
            errors: null,
            data: {
                id: 1,
                name: 'magiamgia',
                value: 1000000.00,
                status: 'ACTIVE'
            } as any
        });

        vi.mocked(OrderService.CreateOrder).mockResolvedValue({
            status: 201,
            success: true,
            message: 'Created',
            errors: null,
            data: {
                id: 1
            } as any
        });


        // act
        renderCheckoutPage();
        fireEvent.change(screen.getByPlaceholderText('0987654321'), {
            target: { value: '0909888333' }
        });
        fireEvent.change(screen.getByPlaceholderText('Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành'), {
            target: { value: '123 abc' }
        });
        fireEvent.change(screen.getByPlaceholderText('Nhập mã giảm giá...'), {
            target: { value: 'magiamgia' }
        });
        fireEvent.click(screen.getByRole('button', {
            name: /Áp dụng/i
        }));

        await waitFor(() => {
            expect(CouponService.CheckCoupon).toHaveBeenCalledWith('magiamgia', 137970000);
            expect(screen.getByText(/Giảm giá \(magiamgia\)/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', {
            name: /Đặt hàng/i
        }));

        // assert
        await waitFor(() => {
            expect(InventoryService.CheckStock).toHaveBeenCalledWith({
                items: [
                    { productId: 1, quantity: 3 }
                ]
            });

            expect(OrderService.CreateOrder).toHaveBeenCalledWith({
                fullName: 'Nguyen Van A',
                phone: '0909888333',
                address: '123 abc',
                paymentMethod: 'COD',
                couponCode: 'magiamgia',
                items: [
                    { productId: 1, quantity: 3 }
                ]
            });
        });
    });


    test('Purchase: Hien loi voi coupon khong dung', async () => {
        vi.mocked(CouponService.CheckCoupon).mockRejectedValue({
            status: 400,
            success: false,
            message: 'Bad Request',
            errors: 'Không tìm thấy mã giảm giá',
            data: null
        });

        
        renderCheckoutPage();
        fireEvent.change(screen.getByPlaceholderText('Nhập mã giảm giá...'), {
            target: { value: 'khongtontai' }
        });
        fireEvent.click(screen.getByRole('button', {
            name: /Áp dụng/i
        }));

        await waitFor(() => {
            expect(CouponService.CheckCoupon).toHaveBeenCalledWith('khongtontai', 137970000);
            expect(screen.getByText(/Mã giảm giá không hợp lệ hoặc đã hết hạn/i)).toBeInTheDocument();
            expect(mockNotificationContext.showToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'warning',
                    title: 'Cảnh báo',
                    message: 'Không tìm thấy mã giảm giá'
                })
            );
        });

    });

    test('Purchase: Hien loi khi tong gia tri thap hon gia tri toi thieu de su dung coupon', async () => {
        vi.mocked(CouponService.CheckCoupon).mockRejectedValue({
            status: 400,
            success: false,
            message: 'Bad Request',
            errors: 'Mã giảm giá không đủ điều kiện áp dụng',
            data: null
        });

        renderCheckoutPage();
        fireEvent.change(screen.getByPlaceholderText('Nhập mã giảm giá...'), {
            target: { value: 'magiamgia' }
        });
        fireEvent.click(screen.getByRole('button', { name: /Áp dụng/i }));

        await waitFor(() => {
            expect(CouponService.CheckCoupon).toHaveBeenCalledWith('magiamgia', 137970000);
            expect(screen.getByText(/Mã giảm giá không hợp lệ hoặc đã hết hạn/i)).toBeInTheDocument();
            expect(mockNotificationContext.showToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'warning',
                    title: 'Cảnh báo',
                    message: 'Mã giảm giá không đủ điều kiện áp dụng'
                })
            );
        });
    });

    test('Purchase: Hien loi khi so dien thoai khong dung dinh dang', async () => {
        vi.mocked(InventoryService.CheckStock).mockResolvedValue({
            status: 200,
            success: true,
            message: 'Success',
            errors: null,
            data: true
        });

        vi.mocked(OrderService.CreateOrder).mockRejectedValue({
            status: 400,
            success: false,
            message: 'Bad Request',
            errors: {
                phone: 'Số điện thoại chỉ được chứa 10 chữ số'
            },
            data: null
        });

        renderCheckoutPage();
        fireEvent.change(screen.getByPlaceholderText('0987654321'), {
            target: { value: '09098883331' }
        });

        fireEvent.change(screen.getByPlaceholderText('Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành'), {
            target: { value: '123 abc' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Đặt hàng/i }));

        await waitFor(() => {
            expect(InventoryService.CheckStock).toHaveBeenCalledWith({
                items: [
                    { productId: 1, quantity: 3 }
                ]
            });

            expect(OrderService.CreateOrder).toHaveBeenCalledWith({
                fullName: 'Nguyen Van A',
                address: '123 abc',
                paymentMethod: 'COD',
                phone: '09098883331',
                couponCode: undefined,
                items: [
                    { productId: 1, quantity: 3 }
                ]
            });

            expect(screen.getByText(/Số điện thoại chỉ được chứa 10 chữ số/i)).toBeInTheDocument();
        });
    });

    test('Purchase: Hien loi khi cac field bi bo trong', async () => {
        vi.mocked(InventoryService.CheckStock).mockResolvedValue({
            status: 200,
            success: true,
            message: 'Success',
            errors: null,
            data: true
        });

        vi.mocked(OrderService.CreateOrder).mockRejectedValue({
            status: 400,
            success: false,
            message: 'Bad Request',
            errors: {
                address: 'Địa chỉ nhận hàng không được để trống',
                phone: 'Số điện thoại không được để trống'
            },
            data: null
        });

        renderCheckoutPage();

        fireEvent.click(screen.getByRole('button', { name: /Đặt hàng/i }));

        await waitFor(() => {
            expect(InventoryService.CheckStock).toHaveBeenCalledWith({
                items: [
                    { productId: 1, quantity: 3 }
                ]
            });

            expect(OrderService.CreateOrder).toHaveBeenCalledWith({
                fullName: 'Nguyen Van A',
                address: '',
                paymentMethod: 'COD',
                phone: '',
                couponCode: undefined,
                items: [
                    { productId: 1, quantity: 3 }
                ]
            });

            expect(screen.getByText(/Số điện thoại không được để trống/i)).toBeInTheDocument();
            expect(screen.getByText(/Địa chỉ nhận hàng không được để trống/i)).toBeInTheDocument();
        });
    });
});


// {code: "magiamgia", totalAmount: 55990000}

// coupon api return when coupon code does not exist
// data
// : 
// null
// errors
// : 
// "Không tìm thấy mã giảm giá"
// message
// : 
// "Bad Request"
// status
// : 
// 400
// success
// : 
// false

// {
//     "status": 200,
//     "success": true,
//     "message": "Success",
//     "errors": null,
//     "data": {
//         "id": 1,
//         "name": "magiamgia",
//         "value": 1000000.00,
//         "status": "ACTIVE",
//         "expiryDate": "2030-09-01T17:00:00.000Z",
//         "minimumPurchaseAmount": 5000000.00,
//         "isValid": true
//     }
// }



// {
//     "status": 201,
//     "success": true,
//     "message": "Created",
//     "errors": null,
//     "data": {
//         "id": 6,
//         "fullName": "Luân Chênh",
//         "address": "100 lo sieu",
//         "status": "PENDING",
//         "paymentMethod": "COD",
//         "paymentStatus": "PENDING",
//         "totalAmount": 55990000.00,
//         "shippingFee": 0,
//         "totalQuantity": 1,
//         "user": {
//             "id": 1,
//             "fullName": "Luân Chênh",
//             "email": "abc@gmail.com"
//         },
//         "items": [
//             {
//                 "id": 6,
//                 "product": {
//                     "id": 11,
//                     "mainImageUrl": "https://example.com/images/razer-blade-15-main.jpg",
//                     "name": "Razer Blade 15 Gaming Laptop 2024",
//                     "price": 55990000.00,
//                     "status": "ACTIVE"
//                 },
//                 "quantity": 1,
//                 "total": 55990000.00
//             }
//         ],
//         "coupon": null
//     }
// }

// {
//     "status": 400,
//     "success": false,
//     "message": "Bad Request",
//     "errors": "Mã giảm giá không đủ điều kiện áp dụng",
//     "data": null
// }
