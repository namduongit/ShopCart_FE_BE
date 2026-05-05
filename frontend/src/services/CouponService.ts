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

    /** Kiểm tra coupon còn hiệu lực không — ném lỗi nếu hết hạn/inactive */
    async CheckCoupon(code: string) {
        const response = await api.get<Response<CouponDto>>(`/api/coupons/${code}/check`);
        return response.data;
    },
}

export default CouponService;
