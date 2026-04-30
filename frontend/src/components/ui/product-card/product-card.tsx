import { useContext, useState } from "react";
import { Link } from "react-router";
import type { Product } from "../../../libs/entity/ProductEntity";
import { CartContext } from "../../../contexts/cart-context";

interface ProductCardProps {
    product: Product;
}

const fmtPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

const ProductCard = ({ product }: ProductCardProps) => {
    const cartContext = useContext(CartContext);
    const [added, setAdded] = useState(false);
    const [imgErr, setImgErr] = useState(false);

    const isActive = product.status === "ACTIVE";
    const stock = Number(product.stockQuantity);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        cartContext?.addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <Link to={`/page/product/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
            <div
                className="fade-up"
                style={{
                    background: "#ffffff",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    cursor: "pointer",
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                {/* Image */}
                <div style={{ position: "relative", paddingTop: "75%", background: "#f3f4f6", overflow: "hidden" }}>
                    {!imgErr && product.mainImageUrl ? (
                        <img
                            src={product.mainImageUrl}
                            alt={product.name}
                            onError={() => setImgErr(true)}
                            style={{
                                position: "absolute", inset: 0,
                                width: "100%", height: "100%", objectFit: "cover",
                                transition: "transform 0.3s",
                            }}
                        />
                    ) : (
                        <div style={{
                            position: "absolute", inset: 0, display: "flex",
                            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px"
                        }}>
                            <i className="fa-solid fa-computer" style={{ fontSize: "36px", color: "#d1d5db" }} />
                            <span style={{ fontSize: "12px", color: "#9ca3af" }}>Chưa có ảnh</span>
                        </div>
                    )}

                    {/* Status badge */}
                    {!isActive && (
                        <div style={{
                            position: "absolute", top: "8px", left: "8px",
                            background: "#dc2626", color: "white",
                            fontSize: "11px", fontWeight: 600,
                            padding: "2px 8px", borderRadius: "4px",
                        }}>
                            Hết hàng
                        </div>
                    )}
                    {isActive && stock > 0 && stock <= 5 && (
                        <div style={{
                            position: "absolute", top: "8px", left: "8px",
                            background: "#d97706", color: "white",
                            fontSize: "11px", fontWeight: 600,
                            padding: "2px 8px", borderRadius: "4px",
                        }}>
                            Sắp hết hàng
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    <h3 style={{
                        margin: 0, fontSize: "14px", fontWeight: 600,
                        color: "#111827", lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {product.name}
                    </h3>

                    {/* Specs preview from attributes */}
                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.5 }}>
                            {Object.entries(product.attributes).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </p>
                    )}

                    {/* Price + Button */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "16px", color: "#2563eb" }}>
                            {fmtPrice(product.price)}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isActive}
                            style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                padding: "7px 12px", borderRadius: "6px", border: "none",
                                background: added ? "#16a34a" : isActive ? "#2563eb" : "#e5e7eb",
                                color: isActive ? "white" : "#9ca3af",
                                fontSize: "12px", fontWeight: 600, cursor: isActive ? "pointer" : "not-allowed",
                                fontFamily: "inherit", transition: "background 0.2s",
                            }}
                            onMouseEnter={e => { if (isActive && !added) e.currentTarget.style.background = "#1d4ed8"; }}
                            onMouseLeave={e => { if (!added) e.currentTarget.style.background = isActive ? "#2563eb" : "#e5e7eb"; }}
                        >
                            <i className={added ? "fa-solid fa-check" : "fa-solid fa-cart-plus"} style={{ fontSize: "11px" }} />
                            {added ? "Đã thêm" : "Thêm vào giỏ"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;