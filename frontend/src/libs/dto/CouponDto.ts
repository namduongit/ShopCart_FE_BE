export type CouponDto = {
    id: number;
    name: string;
    value: number;
    status: string;
    expiryDate: string;
    minimumPurchaseAmount: number;
    isValid: boolean;
}