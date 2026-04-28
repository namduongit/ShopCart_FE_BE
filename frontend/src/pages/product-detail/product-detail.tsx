import { useCallback, useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { Product } from "../../libs/types/Product";
import type { Response } from "../../libs/response";
import { Api } from "../../libs/api";
import { CartContext } from "../../contexts/cart-context";
import ProductCard from "../../components/ui/product-card/product-card";

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const cartContext = useContext(CartContext);

    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImg, setSelectedImg] = useState("");
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [tab, setTab] = useState<"specs" | "description">("specs");
    const [imgErr, setImgErr] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError("");
        setImgErr(false);
        try {
            const api = Api();

            // Fetch product detail
            const res = await api.get<Response<Product>>(`/w-version/api/products/${id}`);
            const p = res.data?.data ?? null;
            setProduct(p);
            setSelectedImg(p?.mainImageUrl ?? "");

            // Fetch related products (all products then filter)
            const allRes = await api.get<Response<Product[]>>("/w-version/api/products/");
            const all: Product[] = Array.isArray(allRes.data?.data) ? allRes.data.data : [];
            const rel = all
                .filter(x => x.id !== Number(id) && x.status === "ACTIVE")
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);
            setRelated(rel);
        } catch {
            setError("Không tìm thấy sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [fetchData]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < qty; i++) cartContext?.addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="container-main" style={{ padding: "32px 20px" }}>
                <div className="skeleton" style={{ height: 16, width: 240, marginBottom: 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                    <div>
                        <div className="skeleton" style={{ paddingTop: "75%", borderRadius: 10 }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: 64, height: 64, borderRadius: 8 }} />)}
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div className="skeleton" style={{ height: 28, width: "80%" }} />
                        <div className="skeleton" style={{ height: 16, width: "50%" }} />
                        <div className="skeleton" style={{ height: 36, width: "45%" }} />
                        <div className="skeleton" style={{ height: 80, borderRadius: 8 }} />
                        <div className="skeleton" style={{ height: 44, borderRadius: 8 }} />
                    </div>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error || !product) {
        return (
            <div className="container-main" style={{ padding: "80px 20px", textAlign: "center" }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: 48, color: "#d1d5db", display: "block", marginBottom: 16 }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>
                    {error || "Không tìm thấy sản phẩm"}
                </h2>
                <p style={{ color: "#9ca3af", marginBottom: 24 }}>ID sản phẩm không hợp lệ hoặc đã bị xóa.</p>
                <Link to="/" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 20px", borderRadius: 8,
                    background: "#2563eb", color: "white", fontWeight: 600, fontSize: 14
                }}>
                    <i className="fa-solid fa-arrow-left" /> Về trang chủ
                </Link>
            </div>
        );
    }

    const isActive = product.status === "ACTIVE";
    const stock = Number(product.stockQuantity);
    const allImages = [product.mainImageUrl, ...product.imageUrls].filter(Boolean);

    return (
        <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
            {/* ── Breadcrumb ── */}
            <div style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
                <div className="container-main" style={{ padding: "10px 20px" }}>
                    <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
                        <Link to="/" style={{ color: "#2563eb" }}>Trang chủ</Link>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
                        <Link to="/page/product" style={{ color: "#2563eb" }}>Sản phẩm</Link>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: 9 }} />
                        <span style={{
                            color: "#374151", maxWidth: 260,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                        }}>
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* ── Main ── */}
            <div className="container-main" style={{ padding: "32px 20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

                    {/* Left: Images */}
                    <div>
                        {/* Main image */}
                        <div style={{
                            background: "#fff", border: "1px solid var(--border)",
                            borderRadius: "10px", overflow: "hidden",
                            position: "relative", paddingTop: "75%"
                        }}>
                            {!imgErr && selectedImg ? (
                                <img
                                    src={selectedImg}
                                    alt={product.name}
                                    onError={() => setImgErr(true)}
                                    style={{
                                        position: "absolute", inset: 0,
                                        width: "100%", height: "100%", objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    position: "absolute", inset: 0, display: "flex",
                                    flexDirection: "column", alignItems: "center",
                                    justifyContent: "center", gap: 10, background: "#f3f4f6"
                                }}>
                                    <i className="fa-solid fa-computer" style={{ fontSize: 56, color: "#d1d5db" }} />
                                    <span style={{ fontSize: 13, color: "#9ca3af" }}>Chưa có ảnh</span>
                                </div>
                            )}
                            {!isActive && (
                                <div style={{
                                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    <span style={{
                                        background: "#dc2626", color: "#fff",
                                        padding: "8px 20px", borderRadius: 6, fontWeight: 700
                                    }}>
                                        Hết hàng
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSelectedImg(img); setImgErr(false); }}
                                        style={{
                                            width: 64, height: 64, borderRadius: 8,
                                            overflow: "hidden", border: "2px solid",
                                            borderColor: selectedImg === img ? "#2563eb" : "var(--border)",
                                            cursor: "pointer", padding: 0, background: "#f3f4f6"
                                        }}
                                    >
                                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {/* Status */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{
                                padding: "3px 10px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                                background: isActive ? "#f0fdf4" : "#fef2f2",
                                color: isActive ? "#16a34a" : "#dc2626",
                                border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`
                            }}>
                                {isActive ? "Còn hàng" : "Hết hàng"}
                            </span>
                            {isActive && stock <= 5 && stock > 0 && (
                                <span style={{
                                    padding: "3px 10px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                                    background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a"
                                }}>
                                    Chỉ còn {stock} sản phẩm
                                </span>
                            )}
                            <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto" }}>
                                SKU #{product.id}
                            </span>
                        </div>

                        {/* Name */}
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div style={{
                            background: "#eff6ff", border: "1px solid #bfdbfe",
                            borderRadius: 8, padding: "16px 20px"
                        }}>
                            <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#1d4ed8" }}>
                                {fmtPrice(product.price)}
                            </p>
                            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
                                Đã bao gồm VAT · Miễn phí vận chuyển
                            </p>
                        </div>

                        {/* Specs preview */}
                        {product.attributes && Object.keys(product.attributes).length > 0 && (
                            <div style={{
                                background: "#fff", border: "1px solid var(--border)",
                                borderRadius: 8, overflow: "hidden"
                            }}>
                                {Object.entries(product.attributes).slice(0, 4).map(([k, v], i) => (
                                    <div key={k} style={{
                                        display: "flex", padding: "9px 16px",
                                        borderBottom: i < 3 ? "1px solid #f3f4f6" : "none",
                                        background: i % 2 === 0 ? "#fff" : "#f9fafb"
                                    }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: "130px" }}>{k}</span>
                                        <span style={{ fontSize: 13, color: "#6b7280" }}>{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Qty + Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Số lượng:</span>
                            <div style={{
                                display: "flex", alignItems: "center",
                                border: "1.5px solid var(--border)", borderRadius: 7, overflow: "hidden"
                            }}>
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    style={{
                                        width: 36, height: 36, border: "none", background: "#fff",
                                        cursor: "pointer", color: "#374151", fontSize: 14,
                                        borderRight: "1px solid var(--border)"
                                    }}
                                >−</button>
                                <span style={{
                                    width: 44, textAlign: "center", fontSize: 14,
                                    fontWeight: 700, color: "#111827"
                                }}>
                                    {qty}
                                </span>
                                <button
                                    onClick={() => setQty(q => Math.min(stock || 99, q + 1))}
                                    disabled={!isActive}
                                    style={{
                                        width: 36, height: 36, border: "none", background: "#fff",
                                        cursor: isActive ? "pointer" : "not-allowed",
                                        color: isActive ? "#374151" : "#d1d5db", fontSize: 14,
                                        borderLeft: "1px solid var(--border)"
                                    }}
                                >+</button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isActive}
                            style={{
                                padding: "13px 24px", borderRadius: 8, border: "none",
                                background: added ? "#16a34a" : isActive ? "#2563eb" : "#e5e7eb",
                                color: isActive ? "white" : "#9ca3af",
                                fontSize: 15, fontWeight: 700, cursor: isActive ? "pointer" : "not-allowed",
                                fontFamily: "inherit", display: "flex", alignItems: "center",
                                justifyContent: "center", gap: 8, transition: "background 0.2s"
                            }}
                            onMouseEnter={e => { if (isActive && !added) e.currentTarget.style.background = "#1d4ed8"; }}
                            onMouseLeave={e => { if (!added) e.currentTarget.style.background = isActive ? "#2563eb" : "#e5e7eb"; }}
                        >
                            <i className={added ? "fa-solid fa-check" : "fa-solid fa-cart-plus"} />
                            {added ? "Đã thêm vào giỏ hàng!" : "Thêm vào giỏ hàng"}
                        </button>

                        {/* Trust */}
                        <div style={{
                            display: "flex", gap: 16, flexWrap: "wrap",
                            padding: "12px 16px", background: "#f9fafb",
                            border: "1px solid var(--border)", borderRadius: 8
                        }}>
                            {[
                                { icon: "fa-shield-halved", text: "Bảo hành chính hãng", color: "#2563eb" },
                                { icon: "fa-truck-fast", text: "Giao hàng nhanh", color: "#16a34a" },
                                { icon: "fa-rotate-left", text: "Đổi trả 7 ngày", color: "#d97706" },
                            ].map(b => (
                                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151" }}>
                                    <i className={`fa-solid ${b.icon}`} style={{ color: b.color }} />
                                    {b.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ marginTop: 48 }}>
                    <div style={{ display: "flex", borderBottom: "2px solid var(--border)", marginBottom: 24 }}>
                        {(["specs", "description"] as const).map(t => {
                            const labels = { specs: "Thông số kỹ thuật", description: "Mô tả sản phẩm" };
                            const active = tab === t;
                            return (
                                <button key={t} onClick={() => setTab(t)} style={{
                                    padding: "10px 20px", border: "none", background: "none",
                                    fontWeight: active ? 700 : 500, fontSize: 14,
                                    color: active ? "#2563eb" : "#6b7280", cursor: "pointer",
                                    fontFamily: "inherit",
                                    borderBottom: `2px solid ${active ? "#2563eb" : "transparent"}`,
                                    marginBottom: "-2px", transition: "all 0.15s"
                                }}>
                                    {labels[t]}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: 24 }}>
                        {tab === "specs" && (
                            Object.keys(product.attributes ?? {}).length > 0 ? (
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        {Object.entries(product.attributes).map(([k, v], i) => (
                                            <tr key={k}>
                                                <td style={{
                                                    padding: "10px 16px", fontWeight: 600, fontSize: 14,
                                                    color: "#374151", width: "30%",
                                                    borderBottom: "1px solid #f3f4f6",
                                                    background: i % 2 === 0 ? "#f9fafb" : "#fff"
                                                }}>{k}</td>
                                                <td style={{
                                                    padding: "10px 16px", fontSize: 14, color: "#6b7280",
                                                    borderBottom: "1px solid #f3f4f6",
                                                    background: i % 2 === 0 ? "#f9fafb" : "#fff"
                                                }}>{String(v)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>Chưa có thông số kỹ thuật.</p>
                            )
                        )}
                        {tab === "description" && (
                            <div>
                                <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                                    {product.name} là sản phẩm máy tính chính hãng với cấu hình mạnh mẽ, đáp ứng mọi nhu cầu
                                    từ làm việc văn phòng đến đồ họa, gaming và lập trình.
                                </p>
                                <ul style={{ marginTop: 14, paddingLeft: 20, color: "#6b7280", fontSize: 14, lineHeight: 2 }}>
                                    <li>Sản phẩm chính hãng, có tem bảo hành rõ ràng</li>
                                    <li>Hỗ trợ kỹ thuật trong suốt thời gian bảo hành</li>
                                    <li>Giao hàng toàn quốc, đóng gói cẩn thận</li>
                                    <li>Đổi trả trong 7 ngày nếu lỗi nhà sản xuất</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Related Products ── */}
                {related.length > 0 && (
                    <div style={{ marginTop: 48 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 20px" }}>
                            Sản phẩm liên quan
                        </h2>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: "16px"
                        }}>
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;