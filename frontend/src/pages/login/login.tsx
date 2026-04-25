
import { useState } from "react";
import Button from "../../components/ui/button/button";
import Form from "../../components/ui/form/form";
import Input from "../../components/ui/input/input";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate('/page/product');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-100">
            <div className="w-full max-w-4xl flex rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white">
                <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-linear-to-br from-blue-100 to-blue-200 p-8">
                    <DotLottieReact
                        src="https://lottie.host/679ab726-497c-4eaf-88b6-a90f741d6b7f/1w85eyNvxf.lottie"
                        loop
                        autoplay
                        style={{ width: '320px', height: '320px', maxWidth: '100%' }}
                    />
                    <h2 className="mt-6 text-xl font-semibold text-blue-700 text-center">Chào mừng đến với Shop Máy Tính</h2>
                    <p className="text-blue-600 text-sm text-center mt-2">Nơi bạn tìm thấy những chiếc PC chất lượng nhất!</p>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
                    <div className="flex flex-col items-center mb-6">
                        <span className="text-blue-600 text-4xl mb-2">
                            <i className="fa-solid fa-computer"></i>
                        </span>
                        <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
                        <p className="text-gray-500 text-sm mt-1">Đăng nhập để tiếp tục mua sắm</p>
                    </div>
                    <Form className="space-y-5 text-sm" onSubmit={handleSubmit}>
                        <Input
                            data-testid="email-input"
                            lable="Email"   
                            lableRequired={true}
                            type="email"
                            placeholder="Email"
                            iconStart={<i className="fa-solid fa-at"></i>}
                            required
                        />
                        <Input
                            data-testid="password-input"
                            lable="Mật khẩu"
                            lableRequired={true}
                            type={isShowPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            iconStart={<i className="fa-solid fa-lock"></i>}
                            iconEnd={
                                <i
                                    className={`fa-solid ${isShowPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                />
                            }
                            required
                        />
                        <Button type="submit" data-testid="login-btn" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors shadow-sm">
                            Đăng nhập
                        </Button>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <a href="#" className="hover:underline">Quên mật khẩu?</a>
                            <a href="#" className="hover:underline">Đăng ký tài khoản</a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
