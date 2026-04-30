import { api } from "../libs/api"
import type { JwtDto } from "../libs/dto/JwtDto";
import type { Response } from "../libs/response";

const AuthService = {
    async Login(data: { email: string, password: string }) {
        const response = await api.post<Response<JwtDto>>("/w-version/auth/login", data);
        return response.data;
    },

    async Register() {

    },

    async AuthConfig() {

    }
}

export default AuthService;