import { afterEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { CartDto } from "../libs/dto/CartDto";
import CheckoutPage from "../pages/checkout/checkout";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../contexts/auth-context";
import { CartContext } from "../contexts/cart-context";
import CouponService from "../services/CouponService";
import { NotificateContext } from "../contexts/notificate-context";
import InventoryService from "../services/InventoryService";

vi.mock("../services/CouponService.ts");
vi.mock("../services/InventoryService.ts")
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Checkout component Integration test", () => {
  test("Hien thi tong gia chinh xac", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 1590000,
        product: {
          id: 1,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
          name: "Logitech MX Master 3S",
          price: 1590000,
          status: "ACTIVE",
        },
      },
      {
        id: 1,
        quantity: 1,
        total: 52990000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    ];

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <CartContext.Provider
            value={{
              cartItems: mockCart,
              loading: false,
              addToCart: vi.fn(),
              removeFromCart: vi.fn(),
              clearCart: vi.fn(),
              fetchCart: vi.fn(),
            }}
          >
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("subtotal-display")).toHaveTextContent(
        "54.580.000 ₫",
      );
    });
  });

  test("Hien thi danh sach san pham trong chechout", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 52990000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    ];

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <CartContext.Provider
            value={{
              cartItems: mockCart,
              loading: false,
              addToCart: vi.fn(),
              removeFromCart: vi.fn(),
              clearCart: vi.fn(),
              fetchCart: vi.fn(),
            }}
          >
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText("Apple MacBook Pro 14 inch M3 Pro"),
      ).toBeInTheDocument();
    });
  });

  test("Ap dung phi van chuyen cho don hang duoi 10 trieu", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 1590000,
        product: {
          id: 1,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
          name: "Logitech MX Master 3S",
          price: 1590000,
          status: "ACTIVE",
        },
      },
    ];
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <CartContext.Provider
            value={{
              cartItems: mockCart,
              loading: false,
              addToCart: vi.fn(),
              removeFromCart: vi.fn(),
              clearCart: vi.fn(),
              fetchCart: vi.fn(),
            }}
          >
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("subtotal-display")).toHaveTextContent(
        "1.640.000 ₫",
      );
    });
  });

  test("Tong tien sau khi ap dung ma giam gia hop le", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 52990000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    ];

    vi.mocked(CouponService.CheckCoupon).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 2,
        name: "WELCOME10",
        value: 100000.0,
        status: "ACTIVE",
        expiryDate: "2026-06-29T17:00:00.000Z",
        minimumPurchaseAmount: 500000.0,
        isValid: true,
      },
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <CartContext.Provider
            value={{
              cartItems: mockCart,
              loading: false,
              addToCart: vi.fn(),
              removeFromCart: vi.fn(),
              clearCart: vi.fn(),
              fetchCart: vi.fn(),
            }}
          >
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Apple MacBook Pro 14 inch M3 Pro"),
    ).toBeInTheDocument();
    fireEvent.input(screen.getByTestId("input-coupon"), {
      target: { value: "WELCOME10" },
    });
    fireEvent.click(screen.getByTestId("check-coupon"));
    await waitFor(() => {
      expect(screen.getByTestId("subtotal-display")).toHaveTextContent(
        "52.890.000 ₫",
      );
    });
  });
  test("Kiem tra coupon hop le", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 52990000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    ];

    vi.mocked(CouponService.CheckCoupon).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 2,
        name: "WELCOME10",
        value: 100000.0,
        status: "ACTIVE",
        expiryDate: "2026-06-29T17:00:00.000Z",
        minimumPurchaseAmount: 500000.0,
        isValid: true,
      },
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <CartContext.Provider
            value={{
              cartItems: mockCart,
              loading: false,
              addToCart: vi.fn(),
              removeFromCart: vi.fn(),
              clearCart: vi.fn(),
              fetchCart: vi.fn(),
            }}
          >
            <CheckoutPage />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Apple MacBook Pro 14 inch M3 Pro"),
    ).toBeInTheDocument();
    fireEvent.input(screen.getByTestId("input-coupon"), {
      target: { value: "WELCOME10" },
    });
    fireEvent.click(screen.getByTestId("check-coupon"));
    await waitFor(() => {
      expect(CouponService.CheckCoupon).toHaveBeenCalledWith(
        "WELCOME10",
        52990000.0,
      );
    });
  });
  test("Xu ly loi khi coupon khong hop le", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 52990000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    ];

    vi.mocked(CouponService.CheckCoupon).mockRejectedValue({
      status: 400,
      success: false,
      message: "Bad Request",
      errors: "Không tìm thấy mã giảm giá",
      data: null,
    });

    const showToast = vi.fn();
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <NotificateContext.Provider
            value={{
              showToast,
              showConfirmAlert: vi.fn(),
            }}
          >
            {" "}
            <CartContext.Provider
              value={{
                cartItems: mockCart,
                loading: false,
                addToCart: vi.fn(),
                removeFromCart: vi.fn(),
                clearCart: vi.fn(),
                fetchCart: vi.fn(),
              }}
            >
              <CheckoutPage />
            </CartContext.Provider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Apple MacBook Pro 14 inch M3 Pro"),
    ).toBeInTheDocument();
    fireEvent.input(screen.getByTestId("input-coupon"), {
      target: { value: "WELCOME100" },
    });
    fireEvent.click(screen.getByTestId("check-coupon"));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "warning",
          title: "Cảnh báo",
          message: "Không tìm thấy mã giảm giá",
        }),
      );
    });
  });
  test("Canh bao het hang", async () => {
    const mockCart: CartDto[] = [
      {
        id: 1,
        quantity: 1,
        total: 52990000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    ];

    vi.mocked(InventoryService.CheckStock).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: false,
    });

    const showToast = vi.fn();
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <NotificateContext.Provider
            value={{
              showToast,
              showConfirmAlert: vi.fn(),
            }}
          >
            {" "}
            <CartContext.Provider
              value={{
                cartItems: mockCart,
                loading: false,
                addToCart: vi.fn(),
                removeFromCart: vi.fn(),
                clearCart: vi.fn(),
                fetchCart: vi.fn(),
              }}
            >
              <CheckoutPage />
            </CartContext.Provider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByText("Apple MacBook Pro 14 inch M3 Pro"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("checkout"))
     await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          title: "Lỗi",
          message: "Một số sản phẩm đã hết hàng",
        }),
      );
    });
  });
});
