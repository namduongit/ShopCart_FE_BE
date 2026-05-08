import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CartService from "../services/CartService";
import CartPage from "../pages/cart/cart";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../contexts/auth-context";
import { CartProvider } from "../contexts/cart-context";


import { cleanup } from "@testing-library/react";
import CheckoutPage from "../pages/checkout/checkout";
import { NotificateContext } from "../contexts/notificate-context";


vi.mock("../services/CartService");


afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Cart component Integration tests", () => {
  test("Hien thi gio hang rong khi chua co san pham", async () => {
    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [],
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
          <CartPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("empty-cart-message")).toBeInTheDocument();
    });
  });

  test("Hien thi danh sach san pham", async () => {
    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 4,
          quantity: 1,
          total: 52990000.0,
          product: {
            id: 2,
            mainImageUrl: "https://example.com/images/macbook-pro-14-main.jpg",
            name: "Apple MacBook Pro 14 inch M3 Pro",
            price: 52990000.0,
            status: "ACTIVE",
          },
        },
      ],
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
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("list-carts-product")).toBeInTheDocument();
    });
  });

  test("Click button tang so luong", async () => {
    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 4,
          quantity: 1,
          total: 52990000.0,
          product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000.0,
            status: "ACTIVE",
          },
        },
      ],
    });
    vi.mocked(CartService.AddToCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 5,
        quantity: 2,
        total: 45990000.0,
        product: {
          id: 1,
          mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
          name: "Dell XPS 15 9530",
          price: 45990000.0,
          status: "ACTIVE",
        },
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
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Dell XPS 15 9530")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("increase-quantity"));
    await waitFor(() => {
      expect(CartService.AddToCart).toHaveBeenCalledWith({
        productId: 1,
        quantity: 1,
      });
    });
  });
  test("Click button giam so luong", async () => {
    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 4,
          quantity: 2,
          total: 52990000.0,
          product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000.0,
            status: "ACTIVE",
          },
        },
      ],
    });
    vi.mocked(CartService.RemoveFromCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 5,
        quantity: 1,
        total: 45990000.0,
        product: {
          id: 1,
          mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
          name: "Dell XPS 15 9530",
          price: 45990000.0,
          status: "ACTIVE",
        },
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
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Dell XPS 15 9530")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("reduce-quantity"));
    await waitFor(() => {
      expect(CartService.RemoveFromCart).toHaveBeenCalledWith({
        productId: 1,
        quantity: 1,
      });
    });
  });

  test("Xoa san pham khoi gio hang", async () => {
    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 4,
          quantity: 2,
          total: 52990000.0,
          product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000.0,
            status: "ACTIVE",
          },
        },
      ],
    });
    vi.mocked(CartService.RemoveFromCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: null,
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
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Dell XPS 15 9530")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("remove-product"));

    await waitFor(() => {
      expect(CartService.RemoveFromCart).toHaveBeenCalledWith({
        productId: 1,
        quantity: 2,
      });
    });
  });
  test("Click button thanh toan", async () => {
    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 5,
          quantity: 1,
          total: 45990000,
          product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000,
            status: "ACTIVE",
          },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/page/cart"]}>
        <AuthContext.Provider
          value={{
            state: null,
            isAuthenticated: true,
            saveState: vi.fn(),
            clearState: vi.fn(),
          }}
        >
          <CartProvider>
            <Routes>
              <Route path="/page/cart" element={<CartPage />} />
              <Route path="/page/checkout" element={<CheckoutPage />} />
            </Routes>
          </CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Dell XPS 15 9530")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Tiến hành thanh toán"));

    expect(await screen.findByTestId("checkout-page")).toBeInTheDocument();
  });

  test("Xoa san pham hien thi success message", async () => {
    const showToast = vi.fn();

    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 4,
          quantity: 2,
          total: 52990000,
          product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000,
            status: "ACTIVE",
          },
        },
      ],
    });

    vi.mocked(CartService.RemoveFromCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: null,
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
          <NotificateContext.Provider
            value={{
              showToast,
              showConfirmAlert: vi.fn(),
            }}
          >
            <CartProvider>
              <CartPage />
            </CartProvider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Dell XPS 15 9530")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("remove-product"));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          title: "Đã xóa",
          message: "Sản phẩm đã được xóa khỏi giỏ hàng",
        }),
      );
    });
  });

  test("Handle error tang so luong khi san pham o trang thai inactive ", async () => {
    const showToast = vi.fn();

    vi.mocked(CartService.AddToCart).mockRejectedValue({
      status: 400,
      success: false,
      message: "Bad Request",
      errors: "Sản phẩm đang bị khóa",
      data: null,
    });

    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 10,
          quantity: 1,
          total: 45990000.0,
          product: {
            id: 1,
            mainImageUrl: "https://example.com/images/dell-xps-15-main.jpg",
            name: "Dell XPS 15 9530",
            price: 45990000.0,
            status: "INACTIVE",
          },
        },
      ],
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
          <NotificateContext.Provider
            value={{
              showToast,
              showConfirmAlert: vi.fn(),
            }}
          >
            <CartProvider>
              <CartPage />
            </CartProvider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Dell XPS 15 9530")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("increase-quantity"));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "warning",
          title: "Cảnh báo",
          message: "Sản phẩm đang bị khóa",
        }),
      );
    });
  });
});
