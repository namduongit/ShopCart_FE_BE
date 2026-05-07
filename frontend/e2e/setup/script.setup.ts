type OptionMockResponseFields = {
    status: number,
    contentType: string,
    body: string
}

export const LOGIN_SUCCESS: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": {
            "id": 2,
            "name": "Nguyễn Nam Dương",
            "email": "nguyennamduong@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5uYW1kdW9uZzAwMUBnbWFpbC5jb20iLCJpZCI6MiwiZW1haWwiOiJuZ3V5ZW5uYW1kdW9uZzAwMUBnbWFpbC5jb20iLCJuYW1lIjoiTmd1eeG7hW4gTmFtIETGsMahbmciLCJpYXQiOjE3NzgxMzY5NDIsImV4cCI6MTc3ODIyMzM0Mn0.cUhpvTiXCnrtI7KT3A0nzxC85sdFbyyxCm-t14U5Lr8"
        }
    })
}

export const ADD_CART: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": {
            "id": 23,
            "quantity": 1,
            "total": 10000000.00,
            "product": {
                "id": 6,
                "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
                "name": "MacBook M1 pro",
                "price": 10000000.00,
                "status": "ACTIVE"
            }
        }
    })
}

export const GET_OWNER_CARTS: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": [
            {
                "id": 19,
                "quantity": 1,
                "total": 1590000.00,
                "product": {
                    "id": 21,
                    "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
                    "name": "Logitech MX Master 3S",
                    "price": 1590000.00,
                    "status": "ACTIVE"
                }
            },
            {
                "id": 21,
                "quantity": 1,
                "total": 45990000.00,
                "product": {
                    "id": 1,
                    "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
                    "name": "Dell XPS 15 9530",
                    "price": 45990000.00,
                    "status": "ACTIVE"
                }
            }
        ]
    })
}

export const GET_OWNER_CARTS_AFTER_ADD: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": [
            {
                "id": 19,
                "quantity": 1,
                "total": 1590000.00,
                "product": {
                    "id": 21,
                    "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
                    "name": "Logitech MX Master 3S",
                    "price": 1590000.00,
                    "status": "ACTIVE"
                }
            },
            {
                "id": 21,
                "quantity": 1,
                "total": 45990000.00,
                "product": {
                    "id": 1,
                    "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
                    "name": "Dell XPS 15 9530",
                    "price": 45990000.00,
                    "status": "ACTIVE"
                }
            },
            {
                "id": 23,
                "quantity": 1,
                "total": 10000000.00,
                "product": {
                    "id": 6,
                    "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
                    "name": "MacBook M1 pro",
                    "price": 10000000.00,
                    "status": "ACTIVE"
                }
            }
        ]
    })
}

export const SPECIFIC_PRODUCT: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": {
            "id": 2,
            "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_2__11.png",
            "imageUrls": [
                "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_3__9.png",
                "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_4__9.png",
                "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_5__11_2.png"
            ],
            "name": "Apple MacBook Pro 14 inch M3 Pro",
            "description": "apple-macbook-pro-14-m3-pro",
            "slug": "MacBook Pro 14 inch chip M3 Pro - hiệu năng vượt trội, thời lượng pin cả ngày, màn hình Liquid Retina XDR.",
            "attributes": {
                "Pin": "70 Whr, lên đến 18 giờ sử dụng",
                "RAM": "18 GB Unified Memory",
                "Chip": "Apple M3 Pro (11-core CPU, 14-core GPU)",
                "Wi-Fi": "Wi-Fi 6E (802.11ax)",
                "Camera": "1080p FaceTime HD",
                "Bluetooth": "Bluetooth 5.3",
                "Bàn phím": "Magic Keyboard với Touch ID",
                "Màn hình": "14.2 inch Liquid Retina XDR, 3024x1964, ProMotion 120Hz",
                "Màu sắc": "Space Black",
                "Ổ cứng": "512 GB SSD",
                "Bảo hành": "12 tháng Apple",
                "Trọng lượng": "1.61 kg",
                "Cổng kết nối": "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3",
                "Hệ điều hành": "macOS Sonoma"
            },
            "price": 52990000.00,
            "status": "ACTIVE",
            "inventory": {
                "id": 2,
                "stockQuantity": 30,
                "availableQuantity": 9
            }
        }
    })
}

export const CHECK_STOCK: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        status: 200,
        success: true,
        message: "Success",
        errors: null,
        data: true
    })
}

export const MAKE_PURCHARSE: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 201,
        "success": true,
        "message": "Created",
        "errors": null,
        "data": {
            "id": 3,
            "fullName": "Nguyễn Nam Dương",
            "address": "273 An Dương Vương",
            "status": "PENDING",
            "paymentMethod": "COD",
            "paymentStatus": "PENDING",
            "totalAmount": 47580000.00,
            "shippingFee": 0,
            "totalQuantity": 2,
            "user": {
                "id": 2,
                "fullName": "Nguyễn Nam Dương",
                "email": "nguyennamduong001@gmail.com"
            },
            "items": [
                {
                    "id": 3,
                    "product": {
                        "id": 21,
                        "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png",
                        "name": "Logitech MX Master 3S",
                        "price": 1590000.00,
                        "status": "ACTIVE"
                    },
                    "quantity": 1,
                    "total": 1590000.00
                },
                {
                    "id": 4,
                    "product": {
                        "id": 1,
                        "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
                        "name": "Dell XPS 15 9530",
                        "price": 45990000.00,
                        "status": "ACTIVE"
                    },
                    "quantity": 1,
                    "total": 45990000.00
                },
                {
                    "id": 23,
                    "product": {
                        "id": 6,
                        "mainImageUrl": "https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_9__1_43.png",
                        "name": "MacBook M1 pro",
                        "price": 10000000.00,
                        "status": "ACTIVE"
                    },
                    "quantity": 1,
                    "total": 10000000.00,
                }
            ],
            "coupon": null
        }
    })
}

export const CLEAR_CART: OptionMockResponseFields = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": null
    })
}

export const GET_SPECIFIC_PURCHASE: OptionMockResponseFields = MAKE_PURCHARSE;