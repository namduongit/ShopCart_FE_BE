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

export const MAKE_PURCHARSE: OptionMockResponseFields = {
    status: 200,
    contentType: "",
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
                }
            ],
            "coupon": null
        }
    })
}

export const GET_OWNER_PURCHASES: OptionMockResponseFields = {
    status: 200,
    contentType: "",
    body: JSON.stringify({
        "status": 200,
        "success": true,
        "message": "Success",
        "errors": null,
        "data": [
            {
                "id": 3,
                "fullName": "Nguyễn Nam Dương",
                "address": "273 An Dương Vương",
                "status": "PENDING",
                "paymentMethod": "COD",
                "paymentStatus": "PENDING",
                "totalAmount": 47580000.00,
                "shippingFee": 0.00,
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
                    }
                ],
                "coupon": null
            }
        ]
    })
}