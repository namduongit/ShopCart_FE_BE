import { api } from "../libs/api"
import type { CouponDto } from "../libs/dto/CouponDto";
import type { Response } from "../libs/response";

const CouponService = {
    /** Lấy danh sách tất cả coupon */
    async GetAllCoupons() {
        const response = await api.get<Response<CouponDto[]>>("/api/coupons/");
        return response.data;
    },

    /** Lấy coupon theo mã */
    async GetCouponByCode(code: string) {
        const response = await api.get<Response<CouponDto>>(`/api/coupons/${code}`);
        return response.data;
    },

    /** Kiểm tra coupon còn hiệu lực + đủ điều kiện áp dụng */
    async CheckCoupon(code: string, totalAmount: number) {
        const response = await api.post<Response<CouponDto>>("/api/coupons/check", { code, totalAmount });
        return response.data;
    },
}

export default CouponService;
