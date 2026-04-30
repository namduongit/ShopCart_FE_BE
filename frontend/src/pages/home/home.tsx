import { useCallback, useEffect, useState } from "react";
import type { Response } from "../../libs/response";
import ProductCard from "../../components/ui/product-card/product-card";
import type { ProductDto } from "../../libs/dto/ProductDto";
import { api } from "../../libs/api";

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const SkeletonCard = () => (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
        <div className="skeleton" style={{ paddingTop: "75%" }} />
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton" style={{ height: "14px", width: "85%" }} />
            <div className="skeleton" style={{ height: "12px", width: "60%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                <div className="skeleton" style={{ height: "18px", width: "40%" }} />
                <div className="skeleton" style={{ height: "32px", width: "90px", borderRadius: "6px" }} />
            </div>
        </div>
    </div>
);

const HomePage = () => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get<Response<ProductDto[]>>("/w-version/api/products/");
            // Lấy top 8 sản phẩm, sắp xếp theo giá giảm dần (nổi bật)
            const list: ProductDto[] = Array.isArray(res.data?.data)
                ? res.data.data
                : [];
            const featured = [...list]
                .sort((a, b) => b.price - a.price)
                .slice(0, 8);
            setProducts(featured);
        } catch {
            setError("Không thể tải sản phẩm. Kiểm tra kết nối API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void fetchProducts(); }, [fetchProducts]);

    return (
        <div>
            {/* ── Hero ── */}
            <section style={{ background: "#1e3a8a", padding: "56px 0" }}>
                <div className="container-main">
                    <p style={{ color: "#93c5fd", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                        Cửa hàng máy tính chính hãng
                    </p>
                    <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 14px" }}>
                        Hiệu năng đỉnh cao –<br />Giá cả hợp lý
                    </h1>
                    <p style={{ color: "#bfdbfe", fontSize: "15px", marginBottom: "28px", maxWidth: "480px" }}>
                        Khám phá hàng trăm sản phẩm PC, Laptop, linh kiện chính hãng. Bảo hành toàn quốc, giao hàng nhanh.
                    </p>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <a href="#san-pham" style={{
                            padding: "11px 24px", borderRadius: "8px",
                            background: "#ffffff", color: "#1e3a8a",
                            fontWeight: 700, fontSize: "14px",
                            border: "none", cursor: "pointer",
                            transition: "background 0.15s",
                        }}>
                            Xem sản phẩm
                        </a>
                        <a href="/page/product" style={{
                            padding: "11px 24px", borderRadius: "8px",
                            background: "transparent", color: "#bfdbfe",
                            fontWeight: 600, fontSize: "14px",
                            border: "1.5px solid #3b82f6",
                            cursor: "pointer", transition: "all 0.15s",
                        }}>
                            Tất cả sản phẩm
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section style={{ background: "#1d4ed8", padding: "20px 0" }}>
                <div className="container-main">
                    <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                        {[
                            { label: "Sản phẩm", value: "500+" },
                            { label: "Khách hàng", value: "10.000+" },
                            { label: "Bảo hành", value: "12–24 tháng" },
                            { label: "Giao hàng", value: "Toàn quốc" },
                        ].map(s => (
                            <div key={s.label} style={{ color: "white" }}>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: "20px" }}>{s.value}</p>
                                <p style={{ margin: 0, fontSize: "12px", color: "#bfdbfe" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section id="san-pham" style={{ padding: "48px 0" }}>
                <div className="container-main">
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "24px" }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#111827" }}>
                                Sản phẩm nổi bật
                            </h2>
                            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                                Top 8 sản phẩm cao cấp nhất cửa hàng
                            </p>
                        </div>
                        <a href="/page/product" style={{
                            fontSize: "13px", fontWeight: 600, color: "#2563eb",
                            display: "flex", alignItems: "center", gap: "4px",
                        }}>
                            Xem tất cả <i className="fa-solid fa-arrow-right" style={{ fontSize: "11px" }} />
                        </a>
                    </div>

                    {/* Error */}
                    {error && !loading && (
                        <div style={{
                            padding: "12px 16px", borderRadius: "8px",
                            background: "#fef2f2", border: "1px solid #fecaca",
                            marginBottom: "20px", fontSize: "14px", color: "#dc2626",
                            display: "flex", alignItems: "center", gap: "8px"
                        }}>
                            <i className="fa-solid fa-circle-exclamation" />
                            {error}
                        </div>
                    )}

                    {/* Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "16px"
                    }}>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                            : products.length > 0
                                ? products.map(p => <ProductCard key={p.id} product={p} />)
                                : (
                                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
                                        <i className="fa-solid fa-box-open" style={{ fontSize: "40px", color: "#d1d5db", display: "block", marginBottom: "12px" }} />
                                        <p style={{ color: "#6b7280", fontSize: "15px" }}>Chưa có sản phẩm nào</p>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </section>

            {/* ── Why choose us ── */}
            <section style={{ background: "#ffffff", borderTop: "1px solid var(--border)", padding: "48px 0" }}>
                <div className="container-main">
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", marginBottom: "28px" }}>
                        Tại sao chọn TechShop?
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                        {[
                            { icon: "fa-shield-halved", title: "Hàng chính hãng", desc: "100% sản phẩm có hóa đơn, tem bảo hành rõ ràng", color: "#2563eb" },
                            { icon: "fa-truck-fast", title: "Giao hàng nhanh", desc: "Trong ngày tại nội thành, 1–2 ngày toàn quốc", color: "#16a34a" },
                            { icon: "fa-rotate-left", title: "Đổi trả dễ dàng", desc: "7 ngày đổi trả miễn phí nếu lỗi nhà sản xuất", color: "#d97706" },
                            { icon: "fa-headset", title: "Hỗ trợ kỹ thuật", desc: "Đội ngũ kỹ thuật viên hỗ trợ 8h–22h mỗi ngày", color: "#7c3aed" },
                        ].map(f => (
                            <div key={f.title} style={{
                                padding: "20px",
                                borderRadius: "10px",
                                border: "1px solid var(--border)",
                                background: "#f9fafb",
                            }}>
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "8px",
                                    background: "#eff6ff", display: "flex", alignItems: "center",
                                    justifyContent: "center", marginBottom: "12px"
                                }}>
                                    <i className={`fa-solid ${f.icon}`} style={{ color: f.color, fontSize: "17px" }} />
                                </div>
                                <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>{f.title}</h4>
                                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;