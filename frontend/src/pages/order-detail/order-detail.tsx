import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useExecute } from "../../hooks/useExecute";
import OrderService from "../../services/OrderService";
import type { OrderDto } from "../../libs/dto/OrderDto";

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
    PENDING: { label: "Chờ xác nhận", color: "#d97706", bg: "#fffbeb", border: "#fde68a",  icon: "fa-clock" },
    CONFIRM: { label: "Đã xác nhận",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",  icon: "fa-circle-check" },
    SUCCESS: { label: "Hoàn thành",   color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",  icon: "fa-check-double" },
    FAILED:  { label: "Đã hủy",       color: "#dc2626", bg: "#fef2f2", border: "#fecaca",  icon: "fa-xmark-circle" },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
    PENDING: { label: "Chờ thanh toán", color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "fa-clock" },
    SUCCESS: { label: "Đã thanh toán",  color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "fa-circle-check" },
    FAILED:  { label: "Thanh toán lỗi", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "fa-xmark-circle" },
};

const PAYMENT_METHOD_MAP: Record<string, string> = {
    COD:  "Thanh toán khi nhận hàng (COD)",
    MOMO: "Ví MoMo",
};

const OrderDetailPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { query, data: order, loading } = useExecute<OrderDto>();

    useEffect(() => {
        if (!orderId) return;
        void query(() => OrderService.GetOrderById(Number(orderId)), {});
    }, [orderId]);

    /* Loading */
    if (loading) {
        return (
            <div className="container-main" style={{ padding: "32px 20px" }}>
                <div className="skeleton" style={{ height: 16, width: 280, marginBottom: 28, borderRadius: 6 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                                    <div className="skeleton" style={{ width: 64, height: 64, borderRadius: 8, flexShrink: 0 }} />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                                        <div className="skeleton" style={{ height: 14, width: "70%" }} />
                                        <div className="skeleton" style={{ height: 12, width: "40%" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div className="skeleton" style={{ height: 180, borderRadius: 12 }} />
                        <div className="skeleton" style={{ height: 140, borderRadius: 12 }} />
                    </div>
                </div>
            </div>
        );
    }

    /* Not found */
    if (!order) {
        return (
            <div className="container-main" style={{ padding: "80px 20px", textAlign: "center" }}>
                <i className="fa-solid fa-file-circle-xmark" style={{ fontSize: 48, color: "#d1d5db", display: "block", marginBottom: 16 }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>
                    Không tìm thấy đơn hàng
                </h2>
                <p style={{ color: "#9ca3af", marginBottom: 24 }}>
                    Đơn hàng không tồn tại hoặc bạn không có quyền xem.
                </p>
                <Link to="/page/orders" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#2563eb", color: "white", fontWeight: 600, fontSize: 14,
                }}>
                    <i className="fa-solid fa-arrow-left" /> Lịch sử đơn hàng
                </Link>
            </div>
        );
    }

    const statusInfo = STATUS_MAP[order.status] ?? {
        label: order.status, color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: "fa-circle"
    };
    const paymentStatusInfo = PAYMENT_STATUS_MAP[order.paymentStatus] ?? {
        label: order.paymentStatus, color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: "fa-circle"
    };
    const subtotal = order.items.reduce((s, item) => s + item.total, 0);
    const couponDiscount = order.coupon ? Math.min(order.coupon.value, subtotal) : 0;

    return (
        <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 0" }}>
            <div className="container-main">
                {/* Breadcrumb */}
                <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
                    <Link to="/" style={{ color: "#2563eb" }}>Trang chủ</Link>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
                    <Link to="/page/orders" style={{ color: "#2563eb" }}>Đơn hàng</Link>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
                    <span style={{ color: "#374151" }}>Đơn #{order.id}</span>
                </nav>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>
                        Đơn hàng #{order.id}
                    </h1>
                    <span style={{
                        padding: "5px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                        color: statusInfo.color, background: statusInfo.bg, border: `1px solid ${statusInfo.border}`,
                        display: "flex", alignItems: "center", gap: 6
                    }}>
                        <i className={`fa-solid ${statusInfo.icon}`} style={{ fontSize: 12 }} />
                        {statusInfo.label}
                    </span>
                    <span id="payment-status" style={{
                        padding: "5px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                        color: paymentStatusInfo.color, background: paymentStatusInfo.bg,
                        border: `1px solid ${paymentStatusInfo.border}`,
                        display: "flex", alignItems: "center", gap: 6
                    }}>
                        <i className={`fa-solid ${paymentStatusInfo.icon}`} style={{ fontSize: 12 }} />
                        {paymentStatusInfo.label}
                    </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

                    {/* Left: Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Products */}
                        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "#f9fafb" }}>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                                    <i className="fa-solid fa-box" style={{ color: "#2563eb" }} />
                                    Sản phẩm ({order.totalQuantity})
                                </h3>
                            </div>
                            <div style={{ padding: "8px 0" }}>
                                {order.items.map((item, idx) => (
                                    <div key={item.id} style={{
                                        display: "flex", alignItems: "center", gap: 16,
                                        padding: "14px 20px",
                                        borderBottom: idx < order.items.length - 1 ? "1px solid #f3f4f6" : "none"
                                    }}>
                                        {/* Image */}
                                        <div style={{
                                            width: 64, height: 64, borderRadius: 8, background: "#f3f4f6",
                                            overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)"
                                        }}>
                                            {item.product.mainImageUrl ? (
                                                <img src={item.product.mainImageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <i className="fa-solid fa-computer" style={{ fontSize: 22, color: "#d1d5db" }} />
                                                </div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <Link to={`/page/product/${item.product.id}`} style={{
                                                fontSize: 14, fontWeight: 600, color: "#111827", textDecoration: "none"
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.color = "#2563eb"}
                                                onMouseLeave={e => e.currentTarget.style.color = "#111827"}
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                                                {fmtPrice(item.product.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: 15, fontWeight: 800, color: "#111827", whiteSpace: "nowrap" }}>
                                            {fmtPrice(item.total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping info */}
                        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
                                <i className="fa-solid fa-location-dot" style={{ color: "#2563eb" }} />
                                Thông tin giao hàng
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 120 }}>Người nhận</span>
                                    <span style={{ fontSize: 13, color: "#6b7280" }}>{order.fullName}</span>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 120 }}>Địa chỉ</span>
                                    <span style={{ fontSize: 13, color: "#6b7280" }}>{order.address}</span>
                                </div>
                                {order.user?.email && (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 120 }}>Email</span>
                                        <span style={{ fontSize: 13, color: "#6b7280" }}>{order.user.email}</span>
                                    </div>
                                )}
                                <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                                <div style={{ display: "flex", gap: 8 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 120 }}>Thanh toán</span>
                                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                                        {PAYMENT_METHOD_MAP[order.paymentMethod] ?? order.paymentMethod}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 120 }}>Trạng thái TT</span>
                                    <span style={{
                                        padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                                        color: paymentStatusInfo.color, background: paymentStatusInfo.bg,
                                        border: `1px solid ${paymentStatusInfo.border}`
                                    }}>
                                        <i className={`fa-solid ${paymentStatusInfo.icon}`} style={{ marginRight: 4, fontSize: 11 }} />
                                        {paymentStatusInfo.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Price summary */}
                        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#111827" }}>
                                Tóm tắt thanh toán
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                                    <span>Tạm tính</span>
                                    <span style={{ fontWeight: 600, color: "#111827" }}>{fmtPrice(subtotal)}</span>
                                </div>
                                {order.coupon && couponDiscount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#16a34a" }}>
                                        <span>Giảm giá ({order.coupon.name})</span>
                                        <span style={{ fontWeight: 600 }}>−{fmtPrice(couponDiscount)}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280" }}>
                                    <span>Phí vận chuyển</span>
                                    {order.shippingFee === 0
                                        ? <span style={{ fontWeight: 600, color: "#16a34a" }}>Miễn phí</span>
                                        : <span style={{ fontWeight: 600 }}>{fmtPrice(order.shippingFee)}</span>}
                                </div>
                                <div style={{ height: 1, background: "var(--border)" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 800 }}>
                                    <span style={{ color: "#111827" }}>Tổng cộng</span>
                                    <span style={{ color: "#1d4ed8" }}>{fmtPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Coupon badge */}
                        {order.coupon && (
                            <div style={{
                                background: "#f0fdf4", border: "1px solid #bbf7d0",
                                borderRadius: 10, padding: "12px 16px",
                                display: "flex", alignItems: "center", gap: 10
                            }}>
                                <i className="fa-solid fa-ticket" style={{ color: "#16a34a", fontSize: 18 }} />
                                <div>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#15803d" }}>
                                        Mã giảm giá: {order.coupon.name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: 12, color: "#16a34a" }}>
                                        Đã giảm {fmtPrice(order.coupon.value)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <Link to="/page/orders" style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            padding: "11px", borderRadius: 8, border: "1.5px solid var(--border)",
                            background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14,
                            textDecoration: "none", transition: "border-color 0.15s"
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                            <i className="fa-solid fa-list" /> Tất cả đơn hàng
                        </Link>
                        <Link to="/page/product" style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            padding: "11px", borderRadius: 8, border: "none",
                            background: "#2563eb", color: "white", fontWeight: 600, fontSize: 14,
                            textDecoration: "none", transition: "background 0.15s"
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                            onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                        >
                            <i className="fa-solid fa-store" /> Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
