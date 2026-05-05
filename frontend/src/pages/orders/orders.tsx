import { useEffect } from "react";
import { Link } from "react-router";
import { useExecute } from "../../hooks/useExecute";
import OrderService from "../../services/OrderService";
import type { OrderDto } from "../../libs/dto/OrderDto";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING:    { label: "Chờ xác nhận", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    CONFIRMED:  { label: "Đã xác nhận",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    SHIPPING:   { label: "Đang giao",    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
    DELIVERED:  { label: "Đã giao",      color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    CANCELLED:  { label: "Đã hủy",       color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const OrdersPage = () => {
    const { query, data: orders, loading } = useExecute<OrderDto[]>();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        void query(() => OrderService.GetMyOrders(), {});
    }, []);

    if (!authContext?.isAuthenticated) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "40px 20px" }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 56, color: "#d1d5db" }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#374151", margin: 0 }}>Chưa đăng nhập</h2>
                <p style={{ color: "#6b7280", margin: 0 }}>Vui lòng đăng nhập để xem lịch sử đơn hàng</p>
                <Link to="/page/login" style={{
                    padding: "10px 24px", borderRadius: 8, background: "#2563eb",
                    color: "white", fontWeight: 600, fontSize: 14
                }}>
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    const list = orders ?? [];

    return (
        <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 0" }}>
            <div className="container-main">
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#111827" }}>
                        Lịch sử đơn hàng
                    </h1>
                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                        {loading ? "Đang tải..." : `${list.length} đơn hàng`}
                    </p>
                </div>

                {/* Skeleton */}
                {loading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
                                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                                    <div className="skeleton" style={{ height: 16, width: 120, borderRadius: 6 }} />
                                    <div className="skeleton" style={{ height: 16, width: 80, borderRadius: 6 }} />
                                </div>
                                <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
                                <div className="skeleton" style={{ height: 14, width: "40%" }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && list.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 56, color: "#d1d5db", display: "block", marginBottom: 16 }} />
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Chưa có đơn hàng nào</h2>
                        <p style={{ color: "#9ca3af", marginBottom: 24 }}>Hãy bắt đầu mua sắm để có đơn hàng đầu tiên của bạn</p>
                        <Link to="/page/product" style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "10px 24px", borderRadius: 8, background: "#2563eb",
                            color: "white", fontWeight: 600, fontSize: 14
                        }}>
                            <i className="fa-solid fa-store" /> Khám phá sản phẩm
                        </Link>
                    </div>
                )}

                {/* Orders list */}
                {!loading && list.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {list.map(order => {
                            const statusInfo = STATUS_MAP[order.status] ?? { label: order.status, color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
                            return (
                                <div key={order.id} style={{
                                    background: "#fff", border: "1px solid var(--border)",
                                    borderRadius: 12, overflow: "hidden"
                                }}>
                                    {/* Order header */}
                                    <div style={{
                                        padding: "14px 20px",
                                        borderBottom: "1px solid var(--border)",
                                        display: "flex", alignItems: "center", gap: 12,
                                        flexWrap: "wrap", background: "#f9fafb"
                                    }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                                            Đơn #{order.id}
                                        </span>
                                        <span style={{
                                            padding: "3px 10px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                                            color: statusInfo.color, background: statusInfo.bg,
                                            border: `1px solid ${statusInfo.border}`
                                        }}>
                                            {statusInfo.label}
                                        </span>
                                        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: "auto" }}>
                                            {order.totalQuantity} sản phẩm
                                        </span>
                                    </div>

                                    {/* Order items */}
                                    <div style={{ padding: "16px 20px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                                            {order.items.slice(0, 3).map(item => (
                                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{
                                                        width: 48, height: 48, borderRadius: 8,
                                                        background: "#f3f4f6", overflow: "hidden", flexShrink: 0,
                                                        border: "1px solid var(--border)"
                                                    }}>
                                                        {item.product.mainImageUrl ? (
                                                            <img src={item.product.mainImageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                        ) : (
                                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <i className="fa-solid fa-computer" style={{ fontSize: 18, color: "#d1d5db" }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.product.name}</p>
                                                        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>x{item.quantity}</p>
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                                                        {fmtPrice(item.total)}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                                                    +{order.items.length - 3} sản phẩm khác
                                                </p>
                                            )}
                                        </div>

                                        {/* Order footer */}
                                        <div style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            borderTop: "1px solid var(--border)", paddingTop: 12
                                        }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Giao đến: {order.address}</p>
                                                {order.coupon && (
                                                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#16a34a" }}>
                                                        <i className="fa-solid fa-ticket" style={{ marginRight: 4 }} />
                                                        Mã giảm giá: {order.coupon.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Tổng cộng</p>
                                                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1d4ed8" }}>
                                                    {fmtPrice(order.totalAmount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
