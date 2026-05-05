import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { CartContext } from "../../contexts/cart-context";
import { AuthContext } from "../../contexts/auth-context";
import { NotificateContext } from "../../contexts/notificate-context";

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const CartPage = () => {
    const cartContext = useContext(CartContext);
    const authContext = useContext(AuthContext);
    const notificationContext = useContext(NotificateContext);
    const navigate = useNavigate();

    const cartItems = cartContext?.cartItems ?? [];
    const loading = cartContext?.loading ?? false;

    if (!authContext?.isAuthenticated) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "40px 20px" }}>
                <i className="fa-solid fa-basket-shopping" style={{ fontSize: 56, color: "#d1d5db" }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#374151", margin: 0 }}>Chưa đăng nhập</h2>
                <p style={{ color: "#6b7280", margin: 0 }}>Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
                <Link to="/page/login" style={{
                    padding: "10px 24px", borderRadius: 8, background: "#2563eb",
                    color: "white", fontWeight: 600, fontSize: 14
                }}>
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    const handleChangeQty = async (productId: number, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            // Xóa khỏi giỏ
            await cartContext?.removeFromCart(productId, currentQty);
            notificationContext?.showToast({ id: Date.now(), type: "success", title: "Đã xóa", message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
        } else if (delta > 0) {
                await cartContext?.addToCart(productId, delta);
        } else {
            await cartContext?.removeFromCart(productId, Math.abs(delta));
        }
    };

    const handleRemoveItem = async (productId: number, qty: number) => {
        await cartContext?.removeFromCart(productId, qty);
        notificationContext?.showToast({ id: Date.now(), type: "success", title: "Đã xóa", message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
    };

    const totalAmount = cartItems.reduce((s, item) => s + item.total, 0);
    const totalQty = cartItems.reduce((s, item) => s + item.quantity, 0);

    return (
        <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 0" }}>
            <div className="container-main">
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#111827" }}>
                        Giỏ hàng của bạn
                    </h1>
                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                        {loading ? "Đang tải..." : `${totalQty} sản phẩm`}
                    </p>
                </div>

                {/* Empty state */}
                {!loading && cartItems.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0" }} data-testid="empty-cart-message">
                        <i className="fa-solid fa-basket-shopping" style={{ fontSize: 56, color: "#d1d5db", display: "block", marginBottom: 16 }} />
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Giỏ hàng trống</h2>
                        <p style={{ color: "#9ca3af", marginBottom: 24 }}>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <Link to="/page/product" style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "10px 24px", borderRadius: 8, background: "#2563eb",
                            color: "white", fontWeight: 600, fontSize: 14
                        }}>
                            {/* Illustration */}
                            <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
                                <div style={{
                                    width: 100, height: 100, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto"
                                }}>
                                    <i className="fa-solid fa-basket-shopping" style={{ fontSize: 44, color: "#3b82f6" }} />
                                </div>
                                {/* Badge */}
                                <div style={{
                                    position: "absolute", top: 0, right: -4,
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: "#f3f4f6", border: "2px solid #fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 800, color: "#9ca3af"
                                }}>0</div>
                            </div>

                            <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800, color: "#111827" }}>
                                Giỏ hàng đang trống
                            </h2>
                            <p style={{ margin: "0 0 32px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                                Bạn chưa thêm sản phẩm nào vào giỏ hàng.<br />
                                Khám phá ngay hàng ngàn sản phẩm của chúng tôi!
                            </p>

                            {/* Benefits */}
                            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
                                {[
                                    { icon: "fa-truck-fast", text: "Giao hàng\nnhanh" },
                                    { icon: "fa-shield-halved", text: "Bảo hành\nchính hãng" },
                                    { icon: "fa-rotate-left", text: "Đổi trả\ndễ dàng" },
                                ].map(b => (
                                    <div key={b.icon} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>
                                            <i className={`fa-solid ${b.icon}`} style={{ fontSize: 16, color: "#0ea5e9" }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "pre-line", lineHeight: 1.4, fontWeight: 500 }}>
                                            {b.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <Link to="/page/product" style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    padding: "13px 24px", borderRadius: 10, background: "#2563eb",
                                    color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none",
                                    transition: "background 0.15s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
                                    <i className="fa-solid fa-store" /> Khám phá sản phẩm
                                </Link>
                                <Link to="/" style={{
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                                    padding: "11px 24px", borderRadius: 10,
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#374151", fontWeight: 600, fontSize: 14, textDecoration: "none",
                                    transition: "border-color 0.15s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
                                    <i className="fa-solid fa-house" /> Về trang chủ
                                </Link>
                            </div>
                        </Link>
                    </div>
                )}


                {cartItems.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }} data-testid="list-carts-product">
                        {/* Cart items list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{
                                    background: "#fff", border: "1px solid var(--border)",
                                    borderRadius: 12, padding: "16px 20px",
                                    display: "flex", alignItems: "center", gap: 16
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        width: 80, height: 80, borderRadius: 8,
                                        background: "#f3f4f6", overflow: "hidden", flexShrink: 0,
                                        border: "1px solid var(--border)"
                                    }}>
                                        {item.product.mainImageUrl ? (
                                            <img
                                                src={item.product.mainImageUrl}
                                                alt={item.product.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <i className="fa-solid fa-computer" style={{ fontSize: 28, color: "#d1d5db" }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <Link to={`/page/product/${item.product.id}`} style={{
                                            fontSize: 14, fontWeight: 700, color: "#111827",
                                            textDecoration: "none", display: "block", marginBottom: 4
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
                                            onMouseLeave={e => e.currentTarget.style.color = "#111827"}
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p style={{ margin: "0 0 8px", fontSize: 13, color: item.product.status === "ACTIVE" ? "#16a34a" : "#dc2626" }}>
                                            {item.product.status === "ACTIVE" ? "Còn hàng" : "Hết hàng"}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1d4ed8" }}>
                                            {fmtPrice(item.product.price)}
                                        </p>
                                    </div>

                                    {/* Qty controls */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--border)", borderRadius: 7, overflow: "hidden" }}>
                                            <button
                                            data-testid="reduce-quantity"
                                                onClick={() => handleChangeQty(item.product.id, item.quantity, -1)}
                                                style={{ width: 32, height: 32, border: "none", background: "#fff", cursor: "pointer", fontSize: 14, borderRight: "1px solid var(--border)" }}
                                            >−</button>
                                            <span style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 700 }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                            data-testid="increase-quantity"
                                                onClick={() => handleChangeQty(item.product.id, item.quantity, 1)}
                                                style={{ width: 32, height: 32, border: "none", background: "#fff", cursor: "pointer", fontSize: 14, borderLeft: "1px solid var(--border)" }}
                                            >+</button>
                                        </div>

                                        <button
                                        data-testid="remove-product"
                                            onClick={() => handleRemoveItem(item.product.id, item.quantity)}
                                            title="Xóa sản phẩm"
                                            style={{
                                                width: 32, height: 32, border: "none",
                                                background: "#fef2f2", borderRadius: 7,
                                                cursor: "pointer", color: "#dc2626", fontSize: 13
                                            }}
                                        >
                                            <i className="fa-solid fa-trash" />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div style={{ minWidth: 100, textAlign: "right" }}>
                                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111827" }}>
                                            {fmtPrice(item.total)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{
                            background: "#fff", border: "1px solid var(--border)",
                            borderRadius: 12, padding: 24, position: "sticky", top: 80
                        }}>
                            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: "#111827" }}>
                                Tóm tắt đơn hàng
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                                    <span>Tạm tính ({totalQty} sản phẩm)</span>
                                    <span style={{ fontWeight: 600, color: "#111827" }}>{fmtPrice(totalAmount)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                                    <span>Phí vận chuyển</span>
                                    <span style={{ color: "#16a34a", fontWeight: 600 }}>Miễn phí</span>
                                </div>
                                <div style={{ height: 1, background: "var(--border)" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#111827" }}>
                                    <span>Tổng cộng</span>
                                    <span style={{ color: "#1d4ed8" }}>{fmtPrice(totalAmount)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/page/checkout")}
                                style={{
                                    width: "100%", padding: "13px", borderRadius: 8, border: "none",
                                    background: "#2563eb", color: "white", fontWeight: 700, fontSize: 15,
                                    cursor: "pointer", fontFamily: "inherit", display: "flex",
                                    alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                            >
                                <i className="fa-solid fa-credit-card" /> Tiến hành thanh toán
                            </button>

                            <Link to="/page/product" style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                marginTop: 12, fontSize: 13, color: "#6b7280", textDecoration: "none"
                            }}>
                                <i className="fa-solid fa-arrow-left" style={{ fontSize: 11 }} />
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
