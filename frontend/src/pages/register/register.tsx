import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useExecute } from "../../hooks/useExecute";
import AuthService from "../../services/AuthService";
import SInput from "../../components/ui/sform/sinput/sinput";
import SButton from "../../components/ui/sform/sbutton/sbutton";
import SForm from "../../components/ui/sform/sform";
import type { UserDto } from "../../libs/dto/UserDto";

const RegisterPage = () => {
    const { query, errors, loading } = useExecute<UserDto>();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await query(
            () => AuthService.Register({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                passwordConfirm: form.passwordConfirm,
            }),
            {
                issueNetwork: true,
                onSuccess() {
                    navigate("/page/login");
                },
            }
        );
    };

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

                <SForm onSubmit={handleSubmit}>
                    <SInput
                        name="fullName"
                        errors={errors}
                        value={form.fullName}
                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                        type="text"
                        placeholder="Nguyễn Văn A"
                        options={{
                            label: "Họ và tên",
                            prefix: <i className="fa-regular fa-user" />,
                        }}
                    />

                    <SInput
                        name="email"
                        errors={errors}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        type="email"
                        placeholder="you@example.com"
                        options={{
                            label: "Email",
                            prefix: <i className="fa-regular fa-envelope" />,
                        }}
                    />

                    <SInput
                        name="password"
                        errors={errors}
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Tối thiểu 6 ký tự"
                        options={{
                            label: "Mật khẩu",
                            prefix: <i className="fa-solid fa-lock" />,
                            suffix: {
                                element: <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} style={{ fontSize: "14px" }} />,
                                action: () => setShowPassword(!showPassword),
                            },
                        }}
                    />

                    <SInput
                        name="passwordConfirm"
                        errors={errors}
                        value={form.passwordConfirm}
                        onChange={e => setForm({ ...form, passwordConfirm: e.target.value })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        options={{
                            label: "Xác nhận mật khẩu",
                            prefix: <i className="fa-solid fa-lock" />,
                        }}
                    />

                    <SButton
                        id="register-submit"
                        type="submit"
                        loading={{
                            isLoading: loading,
                            loadingChildren: (
                                <><i className="fa-solid fa-circle-notch fa-spin" /> Đang đăng ký...</>
                            ),
                        }}
                        color={{
                            default: "#2563eb",
                            hover: "#1d4ed8",
                            disabled: "#93c5fd",
                        }}
                        style={{ marginTop: "4px" }}
                    >
                        Tạo tài khoản <i className="fa-solid fa-arrow-right" style={{ fontSize: "12px" }} />
                    </SButton>
                </SForm>

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
