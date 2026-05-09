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