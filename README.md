# ShopCart FE BE

ShopCart FE BE là dự án cửa hàng bán máy tính được xây dựng bằng Spring Boot và React. Dự án phục vụ đồ án môn Kiểm thử phần mềm của thầy Từ Lãng Phiêu, tập trung vào kiểm thử API, kiểm thử component, kiểm thử tích hợp và kiểm thử E2E cho luồng mua hàng.

Tích hợp thanh toán MoMo đang trong quá trình phát triển. Luồng đặt hàng hiện tại hỗ trợ COD và đã có cấu trúc backend/frontend để mở rộng thanh toán MoMo.

## Chức năng chính

- Đăng ký, đăng nhập và lưu trạng thái người dùng bằng JWT.
- Xem danh sách sản phẩm máy tính và chi tiết sản phẩm.
- Quản lý giỏ hàng: thêm sản phẩm, tăng giảm số lượng, xóa sản phẩm, xóa giỏ hàng.
- Kiểm tra tồn kho trước khi đặt hàng.
- Áp dụng mã giảm giá theo điều kiện đơn hàng.
- Tạo đơn hàng, xem danh sách đơn hàng và chi tiết đơn hàng.
- Chọn phương thức thanh toán COD hoặc MoMo.
- Kiểm thử frontend bằng Vitest và Testing Library.
- Kiểm thử E2E bằng Playwright.
- Kiểm thử backend bằng JUnit 5 và Mockito.

## Công nghệ sử dụng

- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Maven.
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router.
- Testing: JUnit 5, Mockito, Vitest, Testing Library, Playwright.
- Database: PostgreSQL.
- DevOps: GitHub Actions, Docker cho PostgreSQL trong môi trường phát triển.

## Cấu trúc thư mục

```text
.
+-- backend
|   +-- src/main/java/com/ShopCart_FE_BE
|   +-- src/main/resources
|   +-- src/test/java/com/ShopCart_FE_BE
+-- frontend
|   +-- src
|   +-- src/tests
|   +-- e2e
+-- HELP.md
+-- README.md
```

## Chạy nhanh

Đọc [HELP.md](HELP.md) để xem chi tiết yêu cầu môi trường, cách cài Docker, cách chạy PostgreSQL, backend, frontend và test.

Tóm tắt luồng chạy local:

```bash
docker run --name shopcart-postgres \
  -e POSTGRES_DB=shop-cart \
  -e POSTGRES_USER=namduongit \
  -e POSTGRES_PASSWORD=NDuong205 \
  -p 5432:5432 \
  -d postgres:16

cd backend
./mvnw spring-boot:run

cd ../frontend
npm ci
npm run dev
```

Sau khi chạy:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

## Lệnh kiểm thử

Backend:

```bash
cd backend
./mvnw test
```

Frontend unit và integration test:

```bash
cd frontend
npm run test:run -- --coverage
```

Frontend E2E test:

```bash
cd frontend
npx playwright install
npm run test:e2e
```

## Ghi chú phát triển

- API frontend hiện trỏ cố định tới `http://localhost:8080` trong `frontend/src/libs/api.ts`.
- CORS backend đang cho phép frontend chạy ở `http://localhost:5173`.
- Cấu hình PostgreSQL mặc định nằm trong `backend/src/main/resources/application.yaml`.
- Các file seed dữ liệu nằm trong `backend/src/main/resources/seed`.
- Thanh toán MoMo đã có cấu hình và DTO nền tảng, nhưng controller/service thanh toán vẫn đang phát triển.
