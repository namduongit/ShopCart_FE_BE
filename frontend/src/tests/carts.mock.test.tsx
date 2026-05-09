import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import CartService from "../services/CartService";
import { MemoryRouter, Route, Routes } from "react-router";
import ProductService from "../services/ProductService";
import { AuthContext } from "../contexts/auth-context";
import { NotificateContext } from "../contexts/notificate-context";
import { CartProvider } from "../contexts/cart-context";
import ProductDetailPage from "../pages/product-detail/product-detail";

vi.mock("../services/CartService.ts");
vi.mock("../services/ProductService.ts");

describe("Cart mock test", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.stubGlobal("scrollTo", vi.fn());

    vi.mocked(CartService.GetCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [],
    });
  });
  test("Mock: Them san pham thanh cong", async () => {
    vi.mocked(ProductService.GetAllProducts).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [
        {
          id: 1,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
          imageUrls: [
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-1.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-2.png",
          ],
          name: "Logitech MX Master 3S",
          description: "logitech-mx-master-3s",
          slug: "Chuột không dây cao cấp Logitech MX Master 3S - độ chính xác 8000 DPI, kết nối Bluetooth & USB, pin 70 ngày.",
          attributes: {
            dpi: "8000",
            brand: "Logitech",
            battery: "70 days",
            connectivity: "Bluetooth/USB",
          },
          price: 1590000.0,
          status: "ACTIVE",
          inventory: {
            id: 1,
            stockQuantity: 0,
            availableQuantity: -1,
          },
        },
        {
          id: 3,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
          imageUrls: [
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_8__1_26.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3_15.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_1__1_61.png",
          ],
          name: "Dell XPS 15 9530",
          description: "dell-xps-15-9530",
          slug: "Laptop cao cấp Dell XPS 15 với màn hình OLED sắc nét, hiệu năng mạnh mẽ cho chuyên gia sáng tạo.",
          attributes: {
            Pin: "86 Whr, sạc nhanh 130W",
            RAM: "16 GB DDR5",
            "Wi-Fi": "Wi-Fi 6E (802.11ax)",
            Bluetooth: "Bluetooth 5.3",
            "Màn hình": "15.6 inch OLED 3.5K (3456x2160)",
            "Màu sắc": "Bạc Platinum",
            "Ổ cứng": "512 GB NVMe SSD",
            "Bảo hành": "12 tháng chính hãng",
            "Bộ xử lý": "Intel Core i7-13700H",
            "Tốc độ CPU": "3.7 GHz (Turbo 5.0 GHz)",
            "Card đồ họa": "NVIDIA GeForce RTX 4060 8 GB",
            "Trọng lượng": "1.86 kg",
            "Cổng kết nối": "2x Thunderbolt 4, 1x USB-A, SD Card, 3.5mm Audio",
            "Hệ điều hành": "Windows 11 Home",
          },
          price: 45990000.0,
          status: "ACTIVE",
          inventory: {
            id: 2,
            stockQuantity: 47,
            availableQuantity: 46,
          },
        },
        {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          imageUrls: [
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__9.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_4__9.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_5__11_2.png",
          ],
          name: "Apple MacBook Pro 14 inch M3 Pro",
          description: "apple-macbook-pro-14-m3-pro",
          slug: "MacBook Pro 14 inch chip M3 Pro - hiệu năng vượt trội, thời lượng pin cả ngày, màn hình Liquid Retina XDR.",
          attributes: {
            Pin: "70 Whr, lên đến 18 giờ sử dụng",
            RAM: "18 GB Unified Memory",
            Chip: "Apple M3 Pro (11-core CPU, 14-core GPU)",
            "Wi-Fi": "Wi-Fi 6E (802.11ax)",
            Camera: "1080p FaceTime HD",
            Bluetooth: "Bluetooth 5.3",
            "Bàn phím": "Magic Keyboard với Touch ID",
            "Màn hình":
              "14.2 inch Liquid Retina XDR, 3024x1964, ProMotion 120Hz",
            "Màu sắc": "Space Black",
            "Ổ cứng": "512 GB SSD",
            "Bảo hành": "12 tháng Apple",
            "Trọng lượng": "1.61 kg",
            "Cổng kết nối": "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3",
            "Hệ điều hành": "macOS Sonoma",
          },
          price: 52990000.0,
          status: "ACTIVE",
          inventory: {
            id: 3,
            stockQuantity: 30,
            availableQuantity: 29,
          },
        },
        {
          id: 5,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/a/laptop_asus_rog_strix_g16_g614ph-s5101w_-_3.png",
          imageUrls: [
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/s/ssss_2__72.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/s/ssss_1__76.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/s/ssss_4__64.png",
          ],
          name: "ASUS ROG Strix G16 2024",
          description: "asus-rog-strix-g16-2024",
          slug: "Laptop gaming ASUS ROG Strix G16 với chip Intel thế hệ mới, RTX 4070, màn hình 240Hz chiến game mượt mà.",
          attributes: {
            Pin: "90 Whr, Adapter 240W",
            RAM: "32 GB DDR5 4800MHz",
            "Wi-Fi": "Wi-Fi 6E (802.11ax)",
            Bluetooth: "Bluetooth 5.3",
            "Bàn phím": "RGB per-key, chống nước",
            "Màn hình": "16 inch IPS 2560x1600, 240Hz, 3ms",
            "Ổ cứng": "1 TB NVMe SSD PCIe 4.0",
            "Bảo hành": "24 tháng chính hãng ASUS",
            "Bộ xử lý": "Intel Core i9-14900HX",
            "Tốc độ CPU": "2.2 GHz (Turbo 5.8 GHz)",
            "Card đồ họa": "NVIDIA GeForce RTX 4070 8 GB GDDR6",
            "Trọng lượng": "2.5 kg",
            "Cổng kết nối": "1x Thunderbolt 4, 3x USB-A 3.2, HDMI 2.1, RJ45",
            "Hệ điều hành": "Windows 11 Home",
            "Hệ thống làm mát": "ROG Intelligent Cooling, 2 quạt tản nhiệt",
          },
          price: 49990000.0,
          status: "ACTIVE",
          inventory: {
            id: 4,
            stockQuantity: 45,
            availableQuantity: 45,
          },
        },
        {
          id: 6,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_-_2023-05-18t203401.618.png",
          imageUrls: [
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_-_2023-05-18t203620.127.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_-_2023-05-18t203411.613.png",
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_-_2023-05-18t203507.247.png",
          ],
          name: "Lenovo ThinkPad X1 Carbon Gen 11",
          description: "lenovo-thinkpad-x1-carbon-gen11",
          slug: "Laptop doanh nghiệp siêu mỏng nhẹ ThinkPad X1 Carbon, bền bỉ chuẩn MIL-SPEC, bảo mật tuyệt đối.",
          attributes: {
            Pin: "57 Whr, lên đến 15 giờ, sạc nhanh RapidCharge",
            RAM: "16 GB LPDDR5",
            "Wi-Fi": "Wi-Fi 6E (802.11ax)",
            Bluetooth: "Bluetooth 5.1",
            "Màn hình": "14 inch IPS 2880x1800, 400 nits, chống chói",
            "Ổ cứng": "512 GB NVMe SSD",
            "Bảo hành": "36 tháng onsite",
            "Bảo mật": "Vân tay, IR Camera, TPM 2.0, ThinkShield",
            "Bộ xử lý": "Intel Core i7-1365U vPro",
            "Chuẩn bền": "MIL-STD-810H (12 tiêu chí)",
            "Tốc độ CPU": "1.8 GHz (Turbo 5.2 GHz)",
            "Card đồ họa": "Intel Iris Xe Graphics",
            "Trọng lượng": "1.12 kg",
            "Cổng kết nối": "2x Thunderbolt 4, 2x USB-A, HDMI 2.0, Audio",
            "Hệ điều hành": "Windows 11 Pro",
          },
          price: 38500000.0,
          status: "ACTIVE",
          inventory: {
            id: 5,
            stockQuantity: 25,
            availableQuantity: 25,
          },
        },
      ],
    });

    vi.mocked(ProductService.GetProductById).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 4,
        mainImageUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
        imageUrls: [
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__9.png",
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_4__9.png",
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_5__11_2.png",
        ],
        name: "Apple MacBook Pro 14 inch M3 Pro",
        description: "apple-macbook-pro-14-m3-pro",
        slug: "MacBook Pro 14 inch chip M3 Pro - hiệu năng vượt trội, thời lượng pin cả ngày, màn hình Liquid Retina XDR.",
        attributes: {
          Pin: "70 Whr, lên đến 18 giờ sử dụng",
          RAM: "18 GB Unified Memory",
          Chip: "Apple M3 Pro (11-core CPU, 14-core GPU)",
          "Wi-Fi": "Wi-Fi 6E (802.11ax)",
          Camera: "1080p FaceTime HD",
          Bluetooth: "Bluetooth 5.3",
          "Bàn phím": "Magic Keyboard với Touch ID",
          "Màn hình": "14.2 inch Liquid Retina XDR, 3024x1964, ProMotion 120Hz",
          "Màu sắc": "Space Black",
          "Ổ cứng": "512 GB SSD",
          "Bảo hành": "12 tháng Apple",
          "Trọng lượng": "1.61 kg",
          "Cổng kết nối": "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3",
          "Hệ điều hành": "macOS Sonoma",
        },
        price: 52990000.0,
        status: "ACTIVE",
        inventory: {
          id: 3,
          stockQuantity: 30,
          availableQuantity: 29,
        },
      },
    });

    vi.mocked(CartService.AddToCart).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 3,
        quantity: 6,
        total: 317940000.0,
        product: {
          id: 4,
          mainImageUrl:
            "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
          name: "Apple MacBook Pro 14 inch M3 Pro",
          price: 52990000.0,
          status: "ACTIVE",
        },
      },
    });

    const showToast = vi.fn();

    render(
      <MemoryRouter initialEntries={["/page/product/4"]}>
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
              <Routes>
                <Route
                  path="/page/product/:id"
                  element={<ProductDetailPage />}
                ></Route>
              </Routes>
            </CartProvider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", {
        name: "Apple MacBook Pro 14 inch M3 Pro",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("add-to-cart"));

    await waitFor(() => {
      expect(CartService.AddToCart).toHaveBeenCalledWith({
        productId: 4,
        quantity: 1,
      });

      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          title: "Đã thêm vào giỏ",
          message:
            "Apple MacBook Pro 14 inch M3 Pro (x1) đã được thêm vào giỏ hàng",
        }),
      );
    });
  });

  test("Mock: Them san pham that bai", async () => {
    vi.mocked(ProductService.GetAllProducts).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [],
    });

    vi.mocked(ProductService.GetProductById).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 4,
        mainImageUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
        imageUrls: [
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__9.png",
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_4__9.png",
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_5__11_2.png",
        ],
        name: "Apple MacBook Pro 14 inch M3 Pro",
        description: "apple-macbook-pro-14-m3-pro",
        slug: "MacBook Pro 14 inch chip M3 Pro - hiệu năng vượt trội, thời lượng pin cả ngày, màn hình Liquid Retina XDR.",
        attributes: {
          RAM: "18 GB Unified Memory",
          Chip: "Apple M3 Pro (11-core CPU, 14-core GPU)",
        },
        price: 52990000.0,
        status: "ACTIVE",
        inventory: {
          id: 3,
          stockQuantity: 30,
          availableQuantity: 29,
        },
      },
    });

    vi.mocked(CartService.AddToCart).mockRejectedValue({
      status: 400,
      success: false,
      message: "Bad Request",
      errors: "Sản phẩm đã hết hàng",
      data: null,
    });

    const showToast = vi.fn();

    render(
      <MemoryRouter initialEntries={["/page/product/4"]}>
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
              <Routes>
                <Route
                  path="/page/product/:id"
                  element={<ProductDetailPage />}
                ></Route>
              </Routes>
            </CartProvider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Apple MacBook Pro 14 inch M3 Pro",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("add-to-cart"));

    await waitFor(() => {
      expect(CartService.AddToCart).toHaveBeenCalledWith({
        productId: 4,
        quantity: 1,
      });
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "warning",
          title: "Cảnh báo",
          message: "Sản phẩm đã hết hàng",
        }),
      );
    });
  });

  test("Mock: Khong them duoc san pham dang bi khoa", async () => {
    vi.mocked(ProductService.GetAllProducts).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [],
    });

    vi.mocked(ProductService.GetProductById).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 4,
        mainImageUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
        imageUrls: [],
        name: "Apple MacBook Pro 14 inch M3 Pro",
        description: "apple-macbook-pro-14-m3-pro",
        slug: "apple-macbook-pro-14-m3-pro",
        attributes: {
          RAM: "18 GB Unified Memory",
          Chip: "Apple M3 Pro (11-core CPU, 14-core GPU)",
        },
        price: 52990000.0,
        status: "INACTIVE",
        inventory: {
          id: 3,
          stockQuantity: 30,
          availableQuantity: 29,
        },
      },
    });

    const showToast = vi.fn();

    render(
      <MemoryRouter initialEntries={["/page/product/4"]}>
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
              <Routes>
                <Route
                  path="/page/product/:id"
                  element={<ProductDetailPage />}
                ></Route>
              </Routes>
            </CartProvider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Apple MacBook Pro 14 inch M3 Pro",
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("add-to-cart")).toBeDisabled();

    fireEvent.click(screen.getByTestId("add-to-cart"));

    expect(CartService.AddToCart).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
  });

  test("Mock: Them san pham that bai vi backend bao san pham dang bi khoa", async () => {
    vi.mocked(ProductService.GetAllProducts).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: [],
    });

    vi.mocked(ProductService.GetProductById).mockResolvedValue({
      status: 200,
      success: true,
      message: "Success",
      errors: null,
      data: {
        id: 4,
        mainImageUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
        imageUrls: [],
        name: "Apple MacBook Pro 14 inch M3 Pro",
        description: "apple-macbook-pro-14-m3-pro",
        slug: "apple-macbook-pro-14-m3-pro",
        attributes: {
          RAM: "18 GB Unified Memory",
          Chip: "Apple M3 Pro (11-core CPU, 14-core GPU)",
        },
        price: 52990000.0,
        status: "ACTIVE",
        inventory: {
          id: 3,
          stockQuantity: 30,
          availableQuantity: 29,
        },
      },
    });

    vi.mocked(CartService.AddToCart).mockRejectedValue({
      status: 400,
      success: false,
      message: "Bad Request",
      errors: "Sản phẩm đang bị khóa",
      data: null,
    });

    const showToast = vi.fn();

    render(
      <MemoryRouter initialEntries={["/page/product/4"]}>
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
              <Routes>
                <Route
                  path="/page/product/:id"
                  element={<ProductDetailPage />}
                ></Route>
              </Routes>
            </CartProvider>
          </NotificateContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", {
        name: "Apple MacBook Pro 14 inch M3 Pro",
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("add-to-cart")).not.toBeDisabled();

    fireEvent.click(screen.getByTestId("add-to-cart"));

    await waitFor(() => {
      expect(CartService.AddToCart).toHaveBeenCalledWith({
        productId: 4,
        quantity: 1,
      });
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
