import { Link, useNavigate } from "react-router";
import { useExecute } from "../../hooks/useExecute";
import AuthService from "../../services/AuthService";
import SInput from "../../components/ui/sform/sinput/sinput";
import SButton from "../../components/ui/sform/sbutton/sbutton";
import SForm from "../../components/ui/sform/sform";
import type { JwtDto } from "../../libs/dto/JwtDto";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { NotificateContext } from "../../contexts/notificate-context";

const LoginPage = () => {
    const { Login } = AuthService;
    const authContext = useContext(AuthContext);
    const notificationContext = useContext(NotificateContext);
    const { query, errors, loading } = useExecute<JwtDto>();
    const navigate = useNavigate();

    const [form, setForm] = useState<{ email: string, password: string }>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await query(() => Login(form), {
            issueNetwork: true,
            onSuccess(data) {
                authContext?.saveState(data!);
                notificationContext?.showToast({
                    id: Date.now(),
                    type: "success",
                    title: "Thành công",
                    message: "Đăng nhập thành công, đang chuyển hướng",
                });
                navigate("/");
            },
        })
    };

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

                <SForm onSubmit={handleSubmit}>
                    <SInput
                        name="email"
                        errors={errors}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        type="email"
                        placeholder="you@example.com"
                        options={{
                            label: (
                                <>
                                    Email
                                </>
                            ),
                            prefix: <i className="fa-regular fa-envelope" />
                        }}
                    />

                    <SInput
                        name="password"
                        errors={errors}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        options={{
                            label: (
                                <>
                                    <span>Mật khẩu</span>
                                    <a href="#" style={{ color: "#2563eb", fontWeight: 500, fontSize: "12px" }}>
                                        Quên mật khẩu?
                                    </a>
                                </>
                            ),
                            prefix: <i className="fa-solid fa-lock" />,
                            suffix: {
                                element: <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} style={{ fontSize: "14px" }} />,
                                action: () => setShowPassword(!showPassword),
                            },
                        }}
                    />

                    <SButton
                        id="login-submit"
                        type="submit"
                        loading={{
                            isLoading: loading,
                            loadingChildren: (
                                <><i className="fa-solid fa-circle-notch fa-spin" /> Đang đăng nhập...</>
                            ),
                        }}
                        color={{
                            default: "#2563eb",
                            hover: "#1d4ed8",
                            disabled: "#93c5fd",
                        }}
                        style={{ marginTop: "4px" }}
                    >
                        Đăng nhập <i className="fa-solid fa-arrow-right" style={{ fontSize: "12px" }} />
                    </SButton>
                </SForm>

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
