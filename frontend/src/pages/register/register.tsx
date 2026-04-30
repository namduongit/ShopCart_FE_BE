import { useState } from "react";
import { Link, useNavigate } from "react-router";

const RegisterPage = () => {
    const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
        if (!form.email) e.email = "Vui lòng nhập email";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email không hợp lệ";
        if (!form.password) e.password = "Vui lòng nhập mật khẩu";
        else if (form.password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";
        if (!form.confirmPassword) e.confirmPassword = "Vui lòng xác nhận mật khẩu";
        else if (form.password !== form.confirmPassword) e.confirmPassword = "Mật khẩu không khớp";
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
            await api.post("/w-version/api/auth/register", {
                fullName: form.fullName,
                email: form.email,
                password: form.password,
            });
            navigate("/page/login");
        } catch {
            setServerError("Đăng ký thất bại. Email có thể đã được sử dụng.");
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
        background: hasErr ? "#fef2f2" : "#fff", transition: "border-color 0.15s",
    });

    const fields: { key: keyof typeof form; label: string; type: string; placeholder: string; icon: string }[] = [
        { key: "fullName", label: "Họ và tên", type: "text", placeholder: "Nguyễn Văn A", icon: "fa-user" },
        { key: "email", label: "Email", type: "email", placeholder: "you@example.com", icon: "fa-envelope" },
        { key: "password", label: "Mật khẩu", type: showPw ? "text" : "password", placeholder: "Tối thiểu 6 ký tự", icon: "fa-lock" },
        { key: "confirmPassword", label: "Xác nhận mật khẩu", type: showPw ? "text" : "password", placeholder: "Nhập lại mật khẩu", icon: "fa-lock" },
    ];

    return (
        <div style={{
            minHeight: "calc(100vh - 120px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "40px 20px", background: "#f9fafb"
        }}>
            <div style={{
                width: "100%", maxWidth: "440px",
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
                        Tạo tài khoản
                    </h1>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                        Đăng ký để mua sắm tại TechShop
                    </p>
                </div>

                {/* Server Error */}
                {serverError && (
                    <div style={{
                        padding: "10px 14px", borderRadius: "7px",
                        background: "#fef2f2", border: "1px solid #fecaca",
                        marginBottom: "18px", display: "flex",
                        alignItems: "center", gap: "8px", fontSize: "13px", color: "#dc2626"
                    }}>
                        <i className="fa-solid fa-circle-exclamation" /> {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {fields.map(f => (
                        <div key={f.key}>
                            <label style={{
                                display: "flex", justifyContent: "space-between",
                                fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px"
                            }}>
                                {f.label}
                            </label>
                            <div style={{ position: "relative" }}>
                                <i className={`fa-regular ${f.icon}`} style={{
                                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                                    color: "#9ca3af", fontSize: "13px", pointerEvents: "none"
                                }} />
                                <input
                                    id={`register-${f.key}`}
                                    type={f.type}
                                    value={form[f.key]}
                                    onChange={onChange(f.key)}
                                    placeholder={f.placeholder}
                                    style={{ ...inputStyle(errors[f.key]), paddingLeft: "36px", paddingRight: f.key === "password" ? "36px" : "14px" }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                                    onBlur={e => e.currentTarget.style.borderColor = errors[f.key] ? "#f87171" : "#e5e7eb"}
                                />
                                {f.key === "password" && (
                                    <button type="button" onClick={() => setShowPw(p => !p)} style={{
                                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0
                                    }}>
                                        <i className={showPw ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} style={{ fontSize: "14px" }} />
                                    </button>
                                )}
                            </div>
                            {errors[f.key] && (
                                <p style={{ fontSize: "12px", color: "#dc2626", margin: "4px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "11px" }} /> {errors[f.key]}
                                </p>
                            )}
                        </div>
                    ))}

                    <button
                        id="register-submit"
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "11px", borderRadius: "8px", border: "none",
                            background: loading ? "#93c5fd" : "#2563eb",
                            color: "white", fontWeight: 700, fontSize: "14px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: "inherit", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "8px", marginTop: "4px",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
                    >
                        {loading ? (
                            <><i className="fa-solid fa-circle-notch fa-spin" /> Đang đăng ký...</>
                        ) : (
                            <>Tạo tài khoản <i className="fa-solid fa-arrow-right" style={{ fontSize: "12px" }} /></>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#6b7280" }}>
                    Đã có tài khoản?{" "}
                    <Link to="/page/login" style={{ color: "#2563eb", fontWeight: 600 }}>
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
