import { api } from "../libs/api"
import type { JwtDto } from "../libs/dto/JwtDto";
import type { UserDto } from "../libs/dto/UserDto";
import type { Response } from "../libs/response";

const AuthService = {
    async Login(data: { email: string, password: string }) {
        const response = await api.post<Response<JwtDto>>("/api/auth/login", data);
        return response.data;
    },

    async Register(data: { fullName: string, email: string, password: string, passwordConfirm: string }) {
        const response = await api.post<Response<UserDto>>("/api/auth/register", data);
        return response.data;
    },
}

export default AuthService;