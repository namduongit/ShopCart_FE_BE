import { useContext, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { CartContext } from "../../contexts/cart-context";
import { AuthContext } from "../../contexts/auth-context";

const WebLayout = () => {
    const cartContext = useContext(CartContext);
    const authContext = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const location = useLocation();

    const cartCount = cartContext?.cartItems.length ?? 0;
    const name = authContext?.state?.name.split(" ").at(-1);

    const [showAction, setShowAction] = useState<boolean>(false);

    const navLinks = [
        { to: "/", label: "Trang chủ" },
        { to: "/page/product", label: "Sản phẩm" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div style={{ background: "#1e40af", padding: "6px 0", textAlign: "center" }}>
                <span style={{ color: "#bfdbfe", fontSize: "13px" }}>
                    <i className="fa-solid fa-fire"></i>
                    Miễn phí vận chuyển toàn quốc cho đơn hàng trên 10.000.000đ
                </span>
            </div>

            <header style={{
                background: "#ffffff",
                borderBottom: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}>
                <div className="container-main" style={{ display: "flex", alignItems: "center", height: "64px", gap: "24px" }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "8px",
                            background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <i className="fa-solid fa-computer" style={{ color: "white", fontSize: "16px" }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "18px", color: "#111827", letterSpacing: "-0.3px" }}>
                            TechShop
                        </span>
                    </Link>

                    {/* Nav */}
                    <nav style={{ display: "flex", gap: "4px" }}>
                        {navLinks.map(link => {
                            const active = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        fontWeight: active ? 600 : 500,
                                        color: active ? "#2563eb" : "#374151",
                                        background: active ? "#eff6ff" : "transparent",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Search */}
                    <div style={{ flex: 1, maxWidth: "400px", position: "relative" }}>
                        <i className="fa-solid fa-magnifying-glass" style={{
                            position: "absolute", left: "12px", top: "50%",
                            transform: "translateY(-50%)", color: "#9ca3af", fontSize: "13px", pointerEvents: "none"
                        }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            style={{
                                width: "100%",
                                padding: "8px 36px 8px 36px",
                                border: "1.5px solid var(--border)",
                                borderRadius: "8px",
                                fontSize: "14px",
                                background: "#f9fafb",
                                color: "#111827",
                                fontFamily: "inherit",
                                transition: "border-color 0.15s",
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#fff"; }}
                            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#f9fafb"; }}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} style={{
                                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0
                            }}>
                                <i className="fa-solid fa-xmark" />
                            </button>
                        )}
                    </div>

                    {/* Right actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                        {/* Cart */}
                        <button style={{
                            position: "relative", display: "flex", alignItems: "center", gap: "8px",
                            padding: "8px 14px", borderRadius: "8px",
                            border: "1.5px solid var(--border)", background: "#fff",
                            cursor: "pointer", fontSize: "13px", color: "#374151", fontFamily: "inherit",
                            transition: "border-color 0.15s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                            <i className="fa-solid fa-basket-shopping" style={{ fontSize: "16px" }} />
                            <span style={{ fontWeight: 500 }}>Giỏ hàng</span>
                            {cartCount > 0 && (
                                <span style={{
                                    background: "#dc2626", color: "white",
                                    borderRadius: "100px", fontSize: "11px", fontWeight: 700,
                                    minWidth: "18px", height: "18px", display: "inline-flex",
                                    alignItems: "center", justifyContent: "center", padding: "0 4px",
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Login */}
                        {!authContext?.isAuthenticated ? (
                            <Link to="/page/login" style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "8px 16px", borderRadius: "8px",
                                background: "#2563eb", color: "white",
                                fontSize: "13px", fontWeight: 600,
                                transition: "background 0.15s",
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                            >
                                <i className="fa-regular fa-circle-user" style={{ fontSize: "15px" }} />
                                Đăng nhập
                            </Link>
                        ) : (
                            <div
                                style={{ position: "relative" }}
                                onClick={() => setShowAction(!showAction)}
                            >
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    padding: "8px 14px", borderRadius: "8px",
                                    background: "#f1f5f9", cursor: "pointer",
                                    fontSize: "13px", fontWeight: 600, color: "#1e293b",
                                }}>
                                    <i className="fa-regular fa-circle-user" style={{ fontSize: "17px", color: "#2563eb" }} />
                                    Xin chào, <span style={{ color: "#2563eb" }}>{name ?? "Người dùng"}</span>
                                    <i className="fa-solid fa-chevron-down" style={{ fontSize: "10px", color: "#64748b" }} />
                                </div>

                                {/* Dropdown */}
                                {showAction && (
                                    <div style={{
                                        position: "absolute", top: "calc(100% + 6px)", right: 0,
                                        background: "white", borderRadius: "10px",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                        border: "1px solid #e2e8f0",
                                        minWidth: "180px", zIndex: 999,
                                        overflow: "hidden",
                                    }}>
                                        <Link to="/page/history" style={{
                                            display: "flex", alignItems: "center", gap: "10px",
                                            padding: "11px 16px", fontSize: "13px",
                                            color: "#334155", textDecoration: "none",
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                        >
                                            <i className="fa-regular fa-clock" style={{ fontSize: "14px", color: "#2563eb", width: "16px" }} />
                                            Lịch sử
                                        </Link>

                                        <div style={{ height: "1px", background: "#f1f5f9", margin: "0 12px" }} />

                                        <button
                                            onClick={() => authContext?.clearState()}
                                            style={{
                                                display: "flex", alignItems: "center", gap: "10px",
                                                padding: "11px 16px", fontSize: "13px",
                                                color: "#ef4444", background: "none",
                                                border: "none", width: "100%", cursor: "pointer",
                                                textAlign: "left",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                        >
                                            <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: "14px", width: "16px" }} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <footer style={{
                background: "#111827", color: "#9ca3af",
                padding: "40px 0 20px", marginTop: "auto"
            }}>
                <div className="container-main">
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "40px", marginBottom: "32px" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                <div style={{
                                    width: "32px", height: "32px", borderRadius: "6px",
                                    background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    <i className="fa-solid fa-computer" style={{ color: "white", fontSize: "14px" }} />
                                </div>
                                <span style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>TechShop</span>
                            </div>
                            <p style={{ fontSize: "13px", lineHeight: 1.7, maxWidth: "280px" }}>
                                Cửa hàng máy tính uy tín – chuyên cung cấp PC, Laptop và linh kiện chính hãng, bảo hành toàn quốc.
                            </p>
                        </div>
                        {[
                            { title: "Hỗ trợ", links: ["Liên hệ", "Chính sách đổi trả", "Theo dõi đơn hàng"] },
                            { title: "Công ty", links: ["Về chúng tôi", "Tuyển dụng", "Blog kỹ thuật"] },
                        ].map(col => (
                            <div key={col.title}>
                                <p style={{ color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "12px" }}>{col.title}</p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {col.links.map(link => (
                                        <li key={link}>
                                            <a href="#" style={{ color: "#9ca3af", fontSize: "13px", transition: "color 0.15s" }}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid #374151", paddingTop: "20px", fontSize: "13px" }}>
                        © 2025 TechShop. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WebLayout;
