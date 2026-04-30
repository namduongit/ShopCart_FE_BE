import { useCallback, useEffect, useState } from "react";
import type { Response } from "../../libs/response";
import ProductCard from "../../components/ui/product-card/product-card";

const SORT_OPTIONS = [
    { value: "price_desc", label: "Giá: Cao đến thấp" },
    { value: "price_asc", label: "Giá: Thấp đến cao" },
    { value: "name_asc", label: "Tên A-Z" },
    { value: "name_desc", label: "Tên Z-A" },
];

const SkeletonCard = () => (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
        <div className="skeleton" style={{ paddingTop: "75%" }} />
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton" style={{ height: "14px", width: "85%" }} />
            <div className="skeleton" style={{ height: "12px", width: "60%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <div className="skeleton" style={{ height: "18px", width: "40%" }} />
                <div className="skeleton" style={{ height: "32px", width: "90px", borderRadius: "6px" }} />
            </div>
        </div>
    </div>
);

const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("price_desc");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const api = Api();
            const res = await api.get<Response<Product[]>>("/w-version/api/products/");
            const list: Product[] = Array.isArray(res.data?.data) ? res.data.data : [];
            setProducts(list);
        } catch {
            setError("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void fetchProducts(); }, [fetchProducts]);

    const displayed = products
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === "price_asc") return a.price - b.price;
            if (sort === "price_desc") return b.price - a.price;
            if (sort === "name_asc") return a.name.localeCompare(b.name);
            if (sort === "name_desc") return b.name.localeCompare(a.name);
            return 0;
        });

    return (
        <div style={{ padding: "32px 0" }}>
            <div className="container-main">
                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800, color: "#111827" }}>
                        Tất cả sản phẩm
                    </h1>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                        {!loading ? `${displayed.length} sản phẩm` : "Đang tải..."}
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "14px 16px", background: "#fff",
                    border: "1px solid var(--border)", borderRadius: "10px",
                    marginBottom: "24px", flexWrap: "wrap"
                }}>
                    {/* Search */}
                    <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                        <i className="fa-solid fa-magnifying-glass" style={{
                            position: "absolute", left: "10px", top: "50%",
                            transform: "translateY(-50%)", color: "#9ca3af", fontSize: "13px", pointerEvents: "none"
                        }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm theo tên sản phẩm..."
                            style={{
                                width: "100%", padding: "8px 10px 8px 32px",
                                border: "1.5px solid var(--border)", borderRadius: "7px",
                                fontSize: "13px", fontFamily: "inherit", color: "#111827",
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                            onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                        />
                    </div>

                    {/* Sort */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <label style={{ fontSize: "13px", color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>
                            Sắp xếp:
                        </label>
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            style={{
                                padding: "8px 12px", border: "1.5px solid var(--border)",
                                borderRadius: "7px", fontSize: "13px",
                                fontFamily: "inherit", color: "#111827", background: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error */}
                {error && !loading && (
                    <div style={{
                        padding: "12px 16px", borderRadius: "8px",
                        background: "#fef2f2", border: "1px solid #fecaca",
                        marginBottom: "20px", fontSize: "14px", color: "#dc2626",
                        display: "flex", alignItems: "center", gap: "8px"
                    }}>
                        <i className="fa-solid fa-circle-exclamation" /> {error}
                    </div>
                )}

                {/* Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "16px",
                }}>
                    {loading
                        ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                        : displayed.length > 0
                            ? displayed.map(p => <ProductCard key={p.id} product={p} />)
                            : (
                                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0" }}>
                                    <i className="fa-solid fa-box-open" style={{ fontSize: "40px", color: "#d1d5db", display: "block", marginBottom: "12px" }} />
                                    <p style={{ color: "#6b7280", fontSize: "15px", margin: 0 }}>
                                        {search ? `Không tìm thấy sản phẩm với từ khoá "${search}"` : "Chưa có sản phẩm nào"}
                                    </p>
                                    {search && (
                                        <button onClick={() => setSearch("")} style={{
                                            marginTop: "12px", padding: "8px 18px", borderRadius: "7px",
                                            border: "1px solid var(--border)", background: "#fff",
                                            fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "#374151"
                                        }}>
                                            Xóa bộ lọc
                                        </button>
                                    )}
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductPage;