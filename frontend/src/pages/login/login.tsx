import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Api } from "../../libs/api";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e: typeof errors = {};
        if (!form.email) e.email = "Vui lòng nhập email";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email không hợp lệ";
        if (!form.password) e.password = "Vui lòng nhập mật khẩu";
        else if (form.password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            const api = Api();
            await api.post("/w-version/api/auth/login", form);
            navigate("/");
        } catch {
            setServerError("Email hoặc mật khẩu không đúng.");
        } finally {
            setLoading(false);
        }
    };

    const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(p => ({ ...p, [field]: e.target.value }));
        setErrors(p => ({ ...p, [field]: undefined }));
        setServerError("");
    };

    const inputStyle = (hasErr?: string): React.CSSProperties => ({
        width: "100%", padding: "10px 14px", fontSize: "14px",
        border: `1.5px solid ${hasErr ? "#f87171" : "#e5e7eb"}`,
        borderRadius: "7px", fontFamily: "inherit", color: "#111827",
        background: hasErr ? "#fef2f2" : "#fff",
        transition: "border-color 0.15s",
    });

    return (
        <div style={{
            minHeight: "calc(100vh - 120px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "40px 20px", background: "#f9fafb"
        }}>
            <div style={{
                width: "100%", maxWidth: "420px",
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: "12px", boxShadow: "var(--shadow-md)", padding: "36px"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{
                        width: "48px", height: "48px", borderRadius: "10px",
                        background: "#2563eb", display: "flex", alignItems: "center",
                        justifyContent: "center", margin: "0 auto 14px"
                    }}>
                        <i className="fa-solid fa-computer" style={{ color: "white", fontSize: "20px" }} />
                    </div>
                    <h1 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px", color: "#111827" }}>
                        Đăng nhập
                    </h1>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                        Chào mừng trở lại TechShop
                    </p>
                </div>

                {/* Server Error */}
                {serverError && (
                    <div style={{
                        padding: "10px 14px", borderRadius: "7px",
                        background: "#fef2f2", border: "1px solid #fecaca",
                        marginBottom: "18px", display: "flex", alignItems: "center",
                        gap: "8px", fontSize: "13px", color: "#dc2626"
                    }}>
                        <i className="fa-solid fa-circle-exclamation" />
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Email */}
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                            Email
                        </label>
                        <div style={{ position: "relative" }}>
                            <i className="fa-regular fa-envelope" style={{
                                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                                color: "#9ca3af", fontSize: "13px", pointerEvents: "none"
                            }} />
                            <input
                                id="login-email"
                                type="email"
                                value={form.email}
                                onChange={onChange("email")}
                                placeholder="you@example.com"
                                style={{ ...inputStyle(errors.email), paddingLeft: "36px" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                                onBlur={e => e.currentTarget.style.borderColor = errors.email ? "#f87171" : "#e5e7eb"}
                            />
                        </div>
                        {errors.email && (
                            <p style={{ fontSize: "12px", color: "#dc2626", margin: "4px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "11px" }} /> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            display: "flex", justifyContent: "space-between",
                            fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px"
                        }}>
                            <span>Mật khẩu</span>
                            <a href="#" style={{ color: "#2563eb", fontWeight: 500, fontSize: "12px" }}>Quên mật khẩu?</a>
                        </label>
                        <div style={{ position: "relative" }}>
                            <i className="fa-solid fa-lock" style={{
                                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                                color: "#9ca3af", fontSize: "13px", pointerEvents: "none"
                            }} />
                            <input
                                id="login-password"
                                type={showPw ? "text" : "password"}
                                value={form.password}
                                onChange={onChange("password")}
                                placeholder="••••••••"
                                style={{ ...inputStyle(errors.password), paddingLeft: "36px", paddingRight: "36px" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                                onBlur={e => e.currentTarget.style.borderColor = errors.password ? "#f87171" : "#e5e7eb"}
                            />
                            <button type="button" onClick={() => setShowPw(p => !p)} style={{
                                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0
                            }}>
                                <i className={showPw ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} style={{ fontSize: "14px" }} />
                            </button>
                        </div>
                        {errors.password && (
                            <p style={{ fontSize: "12px", color: "#dc2626", margin: "4px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "11px" }} /> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "11px", borderRadius: "8px", border: "none",
                            background: loading ? "#93c5fd" : "#2563eb",
                            color: "white", fontWeight: 700, fontSize: "14px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: "inherit", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "8px", transition: "background 0.15s",
                            marginTop: "4px"
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
                    >
                        {loading ? (
                            <><i className="fa-solid fa-circle-notch fa-spin" /> Đang đăng nhập...</>
                        ) : (
                            <>Đăng nhập <i className="fa-solid fa-arrow-right" style={{ fontSize: "12px" }} /></>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#6b7280" }}>
                    Chưa có tài khoản?{" "}
                    <Link to="/page/register" style={{ color: "#2563eb", fontWeight: 600 }}>
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
