import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router";
import { CartContext } from "../../contexts/cart-context";
import { AuthContext } from "../../contexts/auth-context";
import { NotificateContext } from "../../contexts/notificate-context";
import { useExecute } from "../../hooks/useExecute";
import OrderService from "../../services/OrderService";
import CouponService from "../../services/CouponService";
import SForm from "../../components/ui/sform/sform";
import SInput from "../../components/ui/sform/sinput/sinput";
import SButton from "../../components/ui/sform/sbutton/sbutton";
import type { OrderDto } from "../../libs/dto/OrderDto";
import type { CouponDto } from "../../libs/dto/CouponDto";
import InventoryService, { type CheckStockRequest } from "../../services/InventoryService";

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const FREE_SHIPPING_THRESHOLD = 10_000_000;
const SHIPPING_FEE = 50_000;

const PAYMENT_METHODS: { value: "COD" | "MOMO"; label: string; icon: string }[] = [
    { value: "COD", label: "Thanh toán khi nhận hàng (COD)", icon: "fa-money-bill-wave" },
    { value: "MOMO", label: "Ví MoMo", icon: "fa-wallet" },
];

const CheckoutPage = () => {
    const cartContext = useContext(CartContext);
    const authContext = useContext(AuthContext);
    const notificationContext = useContext(NotificateContext);
    const navigate = useNavigate();

    const { query: queryOrder, loading: orderLoading, errors: orderErrors } = useExecute<OrderDto>();
    const { query: queryCoupon, loading: couponLoading } = useExecute<CouponDto>();
    const { query: queryCheckstock, data: dataCheckStock } = useExecute<boolean>();

    const [form, setForm] = useState({
        fullName: authContext?.state?.name ?? "",
        phone: "",
        address: "",
        couponCode: "",
        paymentMethod: "COD" as "COD" | "MOMO",
    });
    const [coupon, setCoupon] = useState<CouponDto | null>(null);
    const [couponError, setCouponError] = useState("");

    const cartItems = cartContext?.cartItems ?? [];
    const subtotal = cartItems.reduce((s, item) => s + item.total, 0);
    const discount = coupon ? Math.min(coupon.value, subtotal) : 0;
    const afterDiscount = subtotal - discount;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = afterDiscount + shippingFee;

    if (!authContext?.isAuthenticated) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "40px 20px" }}>
                <i className="fa-solid fa-lock" style={{ fontSize: 48, color: "#d1d5db" }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#374151", margin: 0 }}>Chưa đăng nhập</h2>
                <Link to="/page/login" style={{ padding: "10px 24px", borderRadius: 8, background: "#2563eb", color: "white", fontWeight: 600, fontSize: 14 }}>Đăng nhập ngay</Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "40px 20px" }}>
                <i className="fa-solid fa-basket-shopping" style={{ fontSize: 48, color: "#d1d5db" }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#374151", margin: 0 }}>Giỏ hàng trống</h2>
                <Link to="/page/product" style={{ padding: "10px 24px", borderRadius: 8, background: "#2563eb", color: "white", fontWeight: 600, fontSize: 14 }}>Tiếp tục mua sắm</Link>
            </div>
        );
    }

    const handleApplyCoupon = async () => {
        if (!form.couponCode.trim()) return;
        setCouponError("");
        setCoupon(null);
        await queryCoupon(() => CouponService.CheckCoupon(form.couponCode.trim(), subtotal), {
            onSuccess(data) {
                if (data) {
                    setCoupon(data);
                    notificationContext?.showToast({ id: Date.now(), type: "success", title: "Áp dụng thành công", message: `Mã "${data.name}" giảm ${fmtPrice(data.value)}` });
                }
            },
            onError() { setCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn"); },
        });
    };

    const handleRemoveCoupon = () => { setCoupon(null); setForm(f => ({ ...f, couponCode: "" })); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.couponCode.trim() && !coupon) {
            notificationContext?.showToast({ id: Date.now(), type: "warning", title: "Mã chưa được áp dụng", message: "Vui lòng nhấn \"Áp dụng\" hoặc xóa mã trước khi đặt hàng." });
            return;
        }

        const checkStockRequest: CheckStockRequest = {
            items: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
        }))
        }

        await queryCheckstock(() => InventoryService.CheckStock(checkStockRequest), { issueNetwork: true });

        if (!dataCheckStock) {
            return;
        }

        let createdOrderId: number | undefined;
        await queryOrder(
            () => OrderService.CreateOrder({
                fullName: form.fullName,
                phone: form.phone,
                address: form.address,
                paymentMethod: form.paymentMethod,
                couponCode: coupon ? form.couponCode.trim() : undefined,
                items: cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })),
            }),
            { issueNetwork: true, onSuccess(data) { createdOrderId = data?.id; } }
        );
        if (createdOrderId !== undefined) {
            await cartContext?.clearCart();
            notificationContext?.showToast({ id: Date.now(), type: "success", title: "Đặt hàng thành công", message: `Đơn hàng #${createdOrderId} đã được tạo!` });
            navigate(`/page/orders/${createdOrderId}`);
        }
    };

    return (
        <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 0" }} data-testid='checkout-page'>
            <div className="container-main">
                <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
                    <Link to="/" style={{ color: "#2563eb" }}>Trang chủ</Link>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
                    <Link to="/page/cart" style={{ color: "#2563eb" }}>Giỏ hàng</Link>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
                    <span style={{ color: "#374151" }}>Thanh toán</span>
                </nav>
                <h1 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#111827" }}>Thanh toán</h1>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
                    {/* Left */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                            <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                                <i className="fa-solid fa-truck" style={{ color: "#2563eb" }} /> Thông tin giao hàng
                            </h3>
                            <SForm onSubmit={handleSubmit} style={{ gap: "16px" }}>
                                <SInput name="fullName" errors={orderErrors} value={form.fullName}
                                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                    type="text" placeholder="Nguyễn Văn A"
                                    options={{ label: "Họ và tên người nhận", prefix: <i className="fa-regular fa-user" /> }} />
                                <SInput name="phone" errors={orderErrors} value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    type="tel" placeholder="0987654321"
                                    options={{ label: "Số điện thoại", prefix: <i className="fa-solid fa-phone" /> }} />
                                <SInput name="address" errors={orderErrors} value={form.address}
                                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                    type="text" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                                    options={{ label: "Địa chỉ giao hàng", prefix: <i className="fa-solid fa-location-dot" /> }} />

                                {/* Payment method */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Phương thức thanh toán</label>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {PAYMENT_METHODS.map(m => (
                                            <label key={m.value} style={{
                                                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                                                borderRadius: 10, cursor: "pointer",
                                                border: `1.5px solid ${form.paymentMethod === m.value ? "#2563eb" : "#e5e7eb"}`,
                                                background: form.paymentMethod === m.value ? "#eff6ff" : "#fff",
                                                transition: "all 0.15s",
                                            }}>
                                                <input type="radio" name="paymentMethod" value={m.value}
                                                    checked={form.paymentMethod === m.value}
                                                    onChange={() => setForm(f => ({ ...f, paymentMethod: m.value }))}
                                                    style={{ accentColor: "#2563eb", width: 16, height: 16 }} />
                                                <i className={`fa-solid ${m.icon}`} style={{ color: form.paymentMethod === m.value ? "#2563eb" : "#9ca3af", width: 16 }} />
                                                <span style={{ fontSize: 13, fontWeight: 600, color: form.paymentMethod === m.value ? "#1d4ed8" : "#374151" }}>{m.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Coupon */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mã giảm giá</label>
                                    {coupon ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
                                            <i className="fa-solid fa-ticket" style={{ color: "#16a34a" }} />
                                            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#15803d" }}>{coupon.name} — Giảm {fmtPrice(coupon.value)}</span>
                                            <button type="button" onClick={handleRemoveCoupon} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 13, padding: 0 }}>
                                                <i className="fa-solid fa-xmark" /> Bỏ
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <div style={{ flex: 1, position: "relative" }}>
                                                <i className="fa-solid fa-tag" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 13, pointerEvents: "none" }} />
                                                <input type="text" value={form.couponCode}
                                                    onChange={e => { setForm(f => ({ ...f, couponCode: e.target.value })); setCouponError(""); }}
                                                    placeholder="Nhập mã giảm giá..."
                                                    style={{ width: "100%", padding: "10px 14px 10px 36px", border: `1.5px solid ${couponError ? "#f87171" : "#e5e7eb"}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: "#111827", boxSizing: "border-box" }}
                                                    onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                                                    onBlur={e => e.currentTarget.style.borderColor = couponError ? "#f87171" : "#e5e7eb"}
                                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void handleApplyCoupon(); } }} />
                                            </div>
                                            <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !form.couponCode.trim()}
                                                style={{ padding: "10px 18px", borderRadius: 8, border: "1.5px solid #2563eb", background: "#fff", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: couponLoading || !form.couponCode.trim() ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap", opacity: !form.couponCode.trim() ? 0.5 : 1 }}>
                                                {couponLoading ? <i className="fa-solid fa-circle-notch fa-spin" /> : "Áp dụng"}
                                            </button>
                                        </div>
                                    )}
                                    {couponError && (
                                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626", display: "flex", alignItems: "center", gap: 4 }}>
                                            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 11 }} /> {couponError}
                                        </p>
                                    )}
                                </div>

                                <SButton id="checkout-submit" type="submit"
                                    loading={{ isLoading: orderLoading, loadingChildren: <><i className="fa-solid fa-circle-notch fa-spin" /> Đang đặt hàng...</> }}
                                    color={{ default: "#2563eb", hover: "#1d4ed8", disabled: "#93c5fd" }}
                                    style={{ marginTop: 4, padding: "13px" }}>
                                    <i className="fa-solid fa-check" /> Đặt hàng ({fmtPrice(total)})
                                </SButton>
                            </SForm>
                        </div>
                    </div>

                    {/* Right: Order summary */}
                    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24, position: "sticky", top: 80 }}>
                        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Đơn hàng của bạn</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f3f4f6", overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)" }}>
                                        {item.product.mainImageUrl
                                            ? <img src={item.product.mainImageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa-solid fa-computer" style={{ fontSize: 18, color: "#d1d5db" }} /></div>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>{item.product.name}</p>
                                        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>x{item.quantity}</p>
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{fmtPrice(item.total)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                                <span>Tạm tính</span>
                                <span style={{ fontWeight: 600, color: "#111827" }}>{fmtPrice(subtotal)}</span>
                            </div>
                            {coupon && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#16a34a" }}>
                                    <span>Giảm giá ({coupon.name})</span>
                                    <span style={{ fontWeight: 600 }}>−{fmtPrice(discount)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    Phí vận chuyển
                                    {shippingFee === 0 && (
                                        <span style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "1px 6px" }}>
                                            ≥ 10 triệu
                                        </span>
                                    )}
                                </span>
                                {shippingFee === 0
                                    ? <span style={{ fontWeight: 600, color: "#16a34a" }}>Miễn phí</span>
                                    : <span style={{ fontWeight: 600, color: "#374151" }}>{fmtPrice(shippingFee)}</span>}
                            </div>
                            {shippingFee > 0 && (
                                <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fefce8", border: "1px solid #fde68a", fontSize: 12, color: "#92400e", display: "flex", alignItems: "center", gap: 6 }}>
                                    <i className="fa-solid fa-truck-fast" style={{ flexShrink: 0 }} />
                                    Mua thêm <strong style={{ color: "#b45309", margin: "0 3px" }}>{fmtPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> để miễn phí vận chuyển
                                </div>
                            )}
                            <div style={{ height: 1, background: "var(--border)" }} />
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#111827" }}>
                                <span>Tổng cộng</span>
                                <span style={{ color: "#1d4ed8" }}>{fmtPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
