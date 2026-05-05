import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CartService from "../services/cartService";
import CartPage from "../pages/cart/cart";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../contexts/auth-context";

vi.mock("../services/cartService");

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
        <AuthContext.Provider value={{
            state:null,
            isAuthenticated:true,
            saveState:vi.fn(),
            clearState:vi.fn()
        }}>
        <CartPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("empty-cart-message")).toBeInTheDocument();
    });
  });
});
