# HELP

Tài liệu này hướng dẫn chuẩn bị môi trường, chạy dự án thủ công, chạy PostgreSQL bằng Docker và chạy test cho dự án ShopCart FE BE.

## Yêu cầu môi trường

- Git.
- Java 21.
- Node.js 22 và npm.
- PostgreSQL 16 hoặc Docker để chạy PostgreSQL bằng container.
- Maven không bắt buộc cài global vì backend có Maven Wrapper tại `backend/mvnw`.
- Playwright browsers nếu cần chạy E2E test.

Các port mặc định:

- Frontend Vite: `5173`.
- Backend Spring Boot: `8080`.
- PostgreSQL: `5432`.
- Playwright HTML report: `9323`.

## Clone dự án

```bash
git clone <repository-url>
cd ShopCart_FE_BE
```

## Cài Docker trên Ubuntu

Nếu máy đã có Docker Desktop hoặc Docker Engine thì có thể bỏ qua phần này. Các lệnh dưới đây theo hướng cài Docker Engine bằng apt repository chính thức của Docker cho Ubuntu.

Tài liệu gốc: https://docs.docker.com/installation/ubuntulinux/

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

```bash
echo "Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc" | sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null
```

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world
```

Cho phép user hiện tại chạy Docker không cần `sudo`:

```bash
sudo usermod -aG docker $USER
newgrp docker
docker run hello-world
```

Nếu không dùng Ubuntu, xem tài liệu chính thức của Docker cho hệ điều hành tương ứng.

## Chạy PostgreSQL bằng Docker

Tạo container PostgreSQL cho môi trường local:

```bash
docker run --name shopcart-postgres \
  -e POSTGRES_DB=shop-cart \
  -e POSTGRES_USER=namduongit \
  -e POSTGRES_PASSWORD=NDuong205 \
  -p 5432:5432 \
  -d postgres:16
```

Kiểm tra container:

```bash
docker ps
```

Nếu container đã tồn tại nhưng đang dừng:

```bash
docker start shopcart-postgres
```

Xóa container khi muốn tạo lại từ đầu:

```bash
docker stop shopcart-postgres
docker rm shopcart-postgres
```

## Chạy PostgreSQL thủ công không dùng Docker

Tạo database và user khớp với cấu hình mặc định trong `backend/src/main/resources/application.yaml`:

```sql
CREATE DATABASE "shop-cart";
CREATE USER namduongit WITH PASSWORD 'NDuong205';
GRANT ALL PRIVILEGES ON DATABASE "shop-cart" TO namduongit;
```

Nếu PostgreSQL yêu cầu phân quyền schema `public`, kết nối vào database `shop-cart` rồi chạy thêm:

```sql
GRANT ALL ON SCHEMA public TO namduongit;
```

## Cấu hình backend

Cấu hình mặc định:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/shop-cart
    username: namduongit
    password: NDuong205
env:
  jwt_secret: this-is-a-long-secret-token-jwt-reuquired-greate-than-32-char
```

Các biến MoMo trong `application.yaml` hiện là placeholder vì thanh toán MoMo đang phát triển:

```yaml
env:
  momo:
    endpoint: cc
    partner_code: cc
    access_key: cc
    secret_key: cc
    ipn: dd
    return: dd
```

Khi có sandbox MoMo thật, thay các giá trị này bằng endpoint, partner code, access key, secret key, IPN URL và return URL tương ứng.

## Chạy backend

Mở terminal tại thư mục gốc dự án:

```bash
cd backend
./mvnw spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080
```

Các nhóm API chính:

- Auth: `/api/auth/`.
- Products: `/api/products/`.
- Carts: `/api/carts/`.
- Coupons: `/api/coupons/`.
- Inventories: `/api/inventories`.
- Purchases: `/api/purchases/`.
- Payments: `/api/payments/`.

## Seed dữ liệu

Backend dùng `ddl-auto: update`, vì vậy nên chạy backend trước để Hibernate tạo bảng. Sau đó có thể seed dữ liệu từ thư mục `backend/src/main/resources/seed`.

Nếu dùng PostgreSQL bằng Docker, chạy từ thư mục gốc dự án:

```bash
docker exec -i shopcart-postgres psql -U namduongit -d shop-cart < backend/src/main/resources/seed/product-inventory.sql
docker exec -i shopcart-postgres psql -U namduongit -d shop-cart < backend/src/main/resources/seed/low.sql
docker exec -i shopcart-postgres psql -U namduongit -d shop-cart < backend/src/main/resources/seed/coupon.sql
```

Nếu dùng PostgreSQL cài trực tiếp:

```bash
psql -U namduongit -d shop-cart -f backend/src/main/resources/seed/product-inventory.sql
psql -U namduongit -d shop-cart -f backend/src/main/resources/seed/low.sql
psql -U namduongit -d shop-cart -f backend/src/main/resources/seed/coupon.sql
```

## Chạy frontend

Mở terminal khác tại thư mục gốc dự án:

```bash
cd frontend
npm ci
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

Frontend hiện gọi API backend tại `http://localhost:8080` trong `frontend/src/libs/api.ts`.

## Chạy toàn bộ dự án thủ công

Thứ tự đề xuất:

1. Chạy PostgreSQL bằng Docker hoặc PostgreSQL cài trực tiếp.
2. Chạy backend bằng `./mvnw spring-boot:run`.
3. Seed dữ liệu nếu database đang trống.
4. Chạy frontend bằng `npm run dev`.
5. Mở `http://localhost:5173`.

## Test backend

```bash
cd backend
./mvnw test
```

Backend hiện có các nhóm test:

- `ApplicationTests`.
- `CartControllerIntegrationTest`.
- `OderControllerIntegrationTest`.
- `OrderServiceMockTest`.

## Test frontend bằng Vitest

```bash
cd frontend
npm ci
npm run test:run -- --coverage
```

Vitest được cấu hình chỉ chạy test trong `frontend/src/**/*.test.{ts,tsx}` để không quét nhầm file Playwright trong `frontend/e2e`.

Các nhóm test frontend hiện có:

- `carts.integration.test.tsx`.
- `purchase.integration.test.tsx`.
- `purchase.mock.test.tsx`.

## Test E2E bằng Playwright

Cài browser cho Playwright:

```bash
cd frontend
npx playwright install
```

Chạy E2E:

```bash
npm run test:e2e
```

Playwright config sẽ tự chạy Vite dev server tại `http://localhost:5173`. Một số API trong E2E được mock bằng `page.route`, nên luồng E2E tập trung vào hành vi giao diện và luồng mua hàng.

Mở report sau khi chạy:

```bash
npx playwright show-report
```

## Build frontend

```bash
cd frontend
npm run build
```

## Lint frontend

```bash
cd frontend
npm run lint
```

## Lỗi thường gặp

Backend không kết nối được database:

- Kiểm tra PostgreSQL đang chạy tại port `5432`.
- Kiểm tra database `shop-cart`, user `namduongit`, password `NDuong205`.
- Nếu dùng Docker, chạy `docker ps` để xem container `shopcart-postgres`.

Frontend gọi API lỗi network:

- Kiểm tra backend đang chạy tại `http://localhost:8080`.
- Kiểm tra CORS trong `SecurityConfig` đang cho phép `http://localhost:5173`.

Vitest quét nhầm file E2E:

- Kiểm tra `frontend/vite.config.ts` có cấu hình `include: ['src/**/*.test.{ts,tsx}']`.

Playwright chưa có browser:

- Chạy `npx playwright install`.

MoMo chưa thanh toán thật:

- Cấu hình MoMo hiện là placeholder.
- `PaymentController` và `MomoService` đang là phần đang phát triển.
- Luồng đặt hàng COD vẫn dùng được để kiểm thử mua hàng.
