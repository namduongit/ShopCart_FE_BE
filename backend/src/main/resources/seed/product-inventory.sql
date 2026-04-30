-- =============================================
-- INSERT 20 SẢN PHẨM MÁY TÍNH
-- =============================================
INSERT INTO products (
    main_image_url, image_urls, name, description, slug,
    attributes, price, status
) VALUES

-- 1. Dell XPS 15
(
    'https://example.com/images/dell-xps-15-main.jpg',
    ARRAY['https://example.com/images/dell-xps-15-1.jpg','https://example.com/images/dell-xps-15-2.jpg','https://example.com/images/dell-xps-15-3.jpg'],
    'Dell XPS 15 9530',
    'Laptop cao cấp Dell XPS 15 với màn hình OLED sắc nét, hiệu năng mạnh mẽ cho chuyên gia sáng tạo.',
    'dell-xps-15-9530',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i7-13700H",
        "Tốc độ CPU": "3.7 GHz (Turbo 5.0 GHz)",
        "RAM": "16 GB DDR5",
        "Ổ cứng": "512 GB NVMe SSD",
        "Màn hình": "15.6 inch OLED 3.5K (3456x2160)",
        "Card đồ họa": "NVIDIA GeForce RTX 4060 8 GB",
        "Pin": "86 Whr, sạc nhanh 130W",
        "Cổng kết nối": "2x Thunderbolt 4, 1x USB-A, SD Card, 3.5mm Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.86 kg",
        "Màu sắc": "Bạc Platinum",
        "Bảo hành": "12 tháng chính hãng"
    }'::jsonb,
    45990000, 'ACTIVE'
),

-- 2. MacBook Pro 14
(
    'https://example.com/images/macbook-pro-14-main.jpg',
    ARRAY['https://example.com/images/macbook-pro-14-1.jpg','https://example.com/images/macbook-pro-14-2.jpg','https://example.com/images/macbook-pro-14-3.jpg'],
    'Apple MacBook Pro 14 inch M3 Pro',
    'MacBook Pro 14 inch chip M3 Pro - hiệu năng vượt trội, thời lượng pin cả ngày, màn hình Liquid Retina XDR.',
    'apple-macbook-pro-14-m3-pro',
    '{
        "Hệ điều hành": "macOS Sonoma",
        "Chip": "Apple M3 Pro (11-core CPU, 14-core GPU)",
        "RAM": "18 GB Unified Memory",
        "Ổ cứng": "512 GB SSD",
        "Màn hình": "14.2 inch Liquid Retina XDR, 3024x1964, ProMotion 120Hz",
        "Camera": "1080p FaceTime HD",
        "Pin": "70 Whr, lên đến 18 giờ sử dụng",
        "Cổng kết nối": "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.61 kg",
        "Màu sắc": "Space Black",
        "Bàn phím": "Magic Keyboard với Touch ID",
        "Bảo hành": "12 tháng Apple"
    }'::jsonb,
    52990000, 'ACTIVE'
),

-- 3. ASUS ROG Strix G16
(
    'https://example.com/images/asus-rog-strix-g16-main.jpg',
    ARRAY['https://example.com/images/asus-rog-strix-g16-1.jpg','https://example.com/images/asus-rog-strix-g16-2.jpg','https://example.com/images/asus-rog-strix-g16-3.jpg'],
    'ASUS ROG Strix G16 2024',
    'Laptop gaming ASUS ROG Strix G16 với chip Intel thế hệ mới, RTX 4070, màn hình 240Hz chiến game mượt mà.',
    'asus-rog-strix-g16-2024',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i9-14900HX",
        "Tốc độ CPU": "2.2 GHz (Turbo 5.8 GHz)",
        "RAM": "32 GB DDR5 4800MHz",
        "Ổ cứng": "1 TB NVMe SSD PCIe 4.0",
        "Màn hình": "16 inch IPS 2560x1600, 240Hz, 3ms",
        "Card đồ họa": "NVIDIA GeForce RTX 4070 8 GB GDDR6",
        "Hệ thống làm mát": "ROG Intelligent Cooling, 2 quạt tản nhiệt",
        "Pin": "90 Whr, Adapter 240W",
        "Cổng kết nối": "1x Thunderbolt 4, 3x USB-A 3.2, HDMI 2.1, RJ45",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "2.5 kg",
        "Bàn phím": "RGB per-key, chống nước",
        "Bảo hành": "24 tháng chính hãng ASUS"
    }'::jsonb,
    49990000, 'ACTIVE'
),

-- 4. Lenovo ThinkPad X1 Carbon
(
    'https://example.com/images/thinkpad-x1-carbon-main.jpg',
    ARRAY['https://example.com/images/thinkpad-x1-carbon-1.jpg','https://example.com/images/thinkpad-x1-carbon-2.jpg','https://example.com/images/thinkpad-x1-carbon-3.jpg'],
    'Lenovo ThinkPad X1 Carbon Gen 11',
    'Laptop doanh nghiệp siêu mỏng nhẹ ThinkPad X1 Carbon, bền bỉ chuẩn MIL-SPEC, bảo mật tuyệt đối.',
    'lenovo-thinkpad-x1-carbon-gen11',
    '{
        "Hệ điều hành": "Windows 11 Pro",
        "Bộ xử lý": "Intel Core i7-1365U vPro",
        "Tốc độ CPU": "1.8 GHz (Turbo 5.2 GHz)",
        "RAM": "16 GB LPDDR5",
        "Ổ cứng": "512 GB NVMe SSD",
        "Màn hình": "14 inch IPS 2880x1800, 400 nits, chống chói",
        "Card đồ họa": "Intel Iris Xe Graphics",
        "Bảo mật": "Vân tay, IR Camera, TPM 2.0, ThinkShield",
        "Pin": "57 Whr, lên đến 15 giờ, sạc nhanh RapidCharge",
        "Cổng kết nối": "2x Thunderbolt 4, 2x USB-A, HDMI 2.0, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.1",
        "Trọng lượng": "1.12 kg",
        "Chuẩn bền": "MIL-STD-810H (12 tiêu chí)",
        "Bảo hành": "36 tháng onsite"
    }'::jsonb,
    38500000, 'ACTIVE'
),

-- 5. HP Spectre x360 14
(
    'https://example.com/images/hp-spectre-x360-14-main.jpg',
    ARRAY['https://example.com/images/hp-spectre-x360-14-1.jpg','https://example.com/images/hp-spectre-x360-14-2.jpg','https://example.com/images/hp-spectre-x360-14-3.jpg'],
    'HP Spectre x360 14 OLED 2-in-1',
    'Laptop 2-in-1 cao cấp HP Spectre x360 với màn hình OLED cảm ứng, xoay 360 độ, kèm bút HP MPP 2.0.',
    'hp-spectre-x360-14-oled',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core Ultra 7 155H",
        "Tốc độ CPU": "1.4 GHz (Turbo 4.8 GHz)",
        "RAM": "16 GB LPDDR5x",
        "Ổ cứng": "1 TB NVMe SSD",
        "Màn hình": "14 inch OLED 2.8K 2880x1800, cảm ứng 10 điểm, 120Hz",
        "Card đồ họa": "Intel Arc Graphics",
        "Kiểu dáng": "2-in-1 xoay 360 độ",
        "Bút cảm ứng": "HP MPP 2.0 Tilt Pen (kèm theo)",
        "Pin": "68 Whr, lên đến 17 giờ",
        "Cổng kết nối": "2x Thunderbolt 4, 1x USB-A, microSD, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.58 kg",
        "Bảo hành": "12 tháng HP Care Pack"
    }'::jsonb,
    36990000, 'ACTIVE'
),

-- 6. Acer Aspire 5 (phổ thông)
(
    'https://example.com/images/acer-aspire-5-main.jpg',
    ARRAY['https://example.com/images/acer-aspire-5-1.jpg','https://example.com/images/acer-aspire-5-2.jpg','https://example.com/images/acer-aspire-5-3.jpg'],
    'Acer Aspire 5 A515-58M',
    'Laptop văn phòng Acer Aspire 5 giá tầm trung, cân bằng hiệu năng và chi phí, phù hợp học tập và làm việc.',
    'acer-aspire-5-a515-58m',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i5-1335U",
        "Tốc độ CPU": "1.3 GHz (Turbo 4.6 GHz)",
        "RAM": "8 GB DDR5 (nâng cấp lên 32 GB)",
        "Ổ cứng": "512 GB NVMe SSD",
        "Màn hình": "15.6 inch IPS Full HD 1920x1080, 60Hz",
        "Card đồ họa": "Intel Iris Xe Graphics",
        "Webcam": "720p HD",
        "Pin": "56 Whr, lên đến 9 giờ",
        "Cổng kết nối": "1x USB-C, 2x USB-A 3.2, 1x USB-A 2.0, HDMI, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 6 (802.11ax)",
        "Bluetooth": "Bluetooth 5.1",
        "Trọng lượng": "1.8 kg",
        "Bảo hành": "24 tháng chính hãng Acer"
    }'::jsonb,
    14990000, 'ACTIVE'
),

-- 7. MSI Titan GT77 HX
(
    'https://example.com/images/msi-titan-gt77-main.jpg',
    ARRAY['https://example.com/images/msi-titan-gt77-1.jpg','https://example.com/images/msi-titan-gt77-2.jpg','https://example.com/images/msi-titan-gt77-3.jpg'],
    'MSI Titan GT77 HX 13VI',
    'Laptop gaming flagship MSI Titan với RTX 4090, màn hình 4K Mini LED 144Hz, đỉnh cao gaming di động.',
    'msi-titan-gt77-hx-13vi',
    '{
        "Hệ điều hành": "Windows 11 Pro",
        "Bộ xử lý": "Intel Core i9-13980HX",
        "Tốc độ CPU": "2.2 GHz (Turbo 5.6 GHz), 24 nhân 32 luồng",
        "RAM": "64 GB DDR5 4800MHz (4 khe, tối đa 128 GB)",
        "Ổ cứng": "2 TB NVMe SSD PCIe 4.0 (RAID 0)",
        "Màn hình": "17.3 inch Mini LED 4K 3840x2160, 144Hz, 1000 nits",
        "Card đồ họa": "NVIDIA GeForce RTX 4090 16 GB GDDR6",
        "Hệ thống làm mát": "Cooler Boost Titan, 5 quạt, 7 ống đồng",
        "Pin": "99.9 Whr, Adapter 330W",
        "Cổng kết nối": "1x Thunderbolt 4, 3x USB-A 3.2, 1x USB-C 3.2, HDMI 2.1, miniDP 1.4, RJ45",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "3.3 kg",
        "Bàn phím": "RGB per-key SteelSeries, Cherry MX Ultra Low Profile",
        "Bảo hành": "24 tháng chính hãng MSI"
    }'::jsonb,
    89990000, 'ACTIVE'
),

-- 8. Lenovo IdeaPad Slim 5
(
    'https://example.com/images/lenovo-ideapad-slim5-main.jpg',
    ARRAY['https://example.com/images/lenovo-ideapad-slim5-1.jpg','https://example.com/images/lenovo-ideapad-slim5-2.jpg','https://example.com/images/lenovo-ideapad-slim5-3.jpg'],
    'Lenovo IdeaPad Slim 5 16ABR8',
    'Laptop mỏng nhẹ Lenovo IdeaPad Slim 5 dùng chip AMD Ryzen 7, màn hình 16 inch 2.5K, thiết kế thanh lịch.',
    'lenovo-ideapad-slim5-16abr8',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "AMD Ryzen 7 7730U",
        "Tốc độ CPU": "2.0 GHz (Turbo 4.5 GHz), 8 nhân 16 luồng",
        "RAM": "16 GB LPDDR4x",
        "Ổ cứng": "512 GB NVMe SSD",
        "Màn hình": "16 inch IPS 2.5K 2560x1600, 60Hz, 400 nits",
        "Card đồ họa": "AMD Radeon 610M Integrated",
        "Webcam": "1080p FHD với bộ lọc ánh sáng xanh",
        "Pin": "75 Whr, sạc nhanh 65W, lên đến 12 giờ",
        "Cổng kết nối": "2x USB-C (1 hỗ trợ PD), 2x USB-A 3.2, HDMI 2.1, Audio",
        "Wi-Fi": "Wi-Fi 6 (802.11ax)",
        "Bluetooth": "Bluetooth 5.1",
        "Trọng lượng": "1.79 kg",
        "Bảo hành": "24 tháng chính hãng Lenovo"
    }'::jsonb,
    18490000, 'ACTIVE'
),

-- 9. ASUS ZenBook 14 OLED
(
    'https://example.com/images/asus-zenbook-14-oled-main.jpg',
    ARRAY['https://example.com/images/asus-zenbook-14-oled-1.jpg','https://example.com/images/asus-zenbook-14-oled-2.jpg','https://example.com/images/asus-zenbook-14-oled-3.jpg'],
    'ASUS ZenBook 14 OLED UX3405MA',
    'Laptop siêu mỏng ASUS ZenBook 14 với màn hình OLED 120Hz, chip Intel Core Ultra, thiết kế Ceraluminum sang trọng.',
    'asus-zenbook-14-oled-ux3405ma',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core Ultra 9 185H",
        "Tốc độ CPU": "2.3 GHz (Turbo 5.1 GHz), 16 nhân 22 luồng",
        "RAM": "32 GB LPDDR5x",
        "Ổ cứng": "1 TB NVMe SSD PCIe 4.0",
        "Màn hình": "14 inch OLED 3K 2880x1800, 120Hz, 550 nits, DCI-P3 100%",
        "Card đồ họa": "Intel Arc Graphics",
        "Vật liệu vỏ": "Ceraluminum (nhôm phủ gốm)",
        "Pin": "75 Whr, lên đến 15 giờ, sạc nhanh 65W",
        "Cổng kết nối": "2x Thunderbolt 4, 1x USB-A 3.2, HDMI 2.1, microSD, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.2 kg",
        "Độ mỏng": "14.9 mm",
        "Bảo hành": "24 tháng ASUS Premium"
    }'::jsonb,
    29990000, 'ACTIVE'
),

-- 10. Dell Inspiron 15 3000
(
    'https://example.com/images/dell-inspiron-15-3000-main.jpg',
    ARRAY['https://example.com/images/dell-inspiron-15-3000-1.jpg','https://example.com/images/dell-inspiron-15-3000-2.jpg','https://example.com/images/dell-inspiron-15-3000-3.jpg'],
    'Dell Inspiron 15 3520',
    'Laptop phổ thông Dell Inspiron 15 giá hợp lý, hiệu năng ổn định cho học sinh sinh viên và gia đình.',
    'dell-inspiron-15-3520',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i5-1235U",
        "Tốc độ CPU": "1.3 GHz (Turbo 4.4 GHz)",
        "RAM": "8 GB DDR4 3200MHz",
        "Ổ cứng": "256 GB NVMe SSD + Khe cắm HDD 2.5 inch",
        "Màn hình": "15.6 inch Full HD 1920x1080, 120Hz, WVA",
        "Card đồ họa": "Intel UHD Graphics",
        "Webcam": "720p HD",
        "Pin": "54 Whr, lên đến 7.5 giờ",
        "Cổng kết nối": "1x USB-C 3.2, 2x USB-A 3.2, 1x USB-A 2.0, HDMI, SD Card, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 5 (802.11ac)",
        "Bluetooth": "Bluetooth 5.0",
        "Trọng lượng": "1.65 kg",
        "Bảo hành": "12 tháng Dell"
    }'::jsonb,
    12490000, 'ACTIVE'
),

-- 11. Razer Blade 15
(
    'https://example.com/images/razer-blade-15-main.jpg',
    ARRAY['https://example.com/images/razer-blade-15-1.jpg','https://example.com/images/razer-blade-15-2.jpg','https://example.com/images/razer-blade-15-3.jpg'],
    'Razer Blade 15 Gaming Laptop 2024',
    'Laptop gaming cao cấp Razer Blade 15 thiết kế CNC nhôm nguyên khối, mỏng nhẹ, hiệu năng RTX 4070 mạnh mẽ.',
    'razer-blade-15-2024',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i7-14700HX",
        "Tốc độ CPU": "2.1 GHz (Turbo 5.5 GHz)",
        "RAM": "16 GB DDR5 5600MHz",
        "Ổ cứng": "1 TB NVMe SSD PCIe 4.0",
        "Màn hình": "15.6 inch QHD+ 2560x1600, 240Hz, 100% DCI-P3",
        "Card đồ họa": "NVIDIA GeForce RTX 4070 8 GB GDDR6",
        "Vỏ máy": "CNC nhôm nguyên khối anodized đen",
        "Hệ thống làm mát": "Vapor Chamber Cooling",
        "Pin": "80 Whr, Adapter 230W",
        "Cổng kết nối": "2x Thunderbolt 4, 3x USB-A 3.2, SD Card UHS-II, HDMI 2.1, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "2.01 kg",
        "Bảo hành": "12 tháng Razer"
    }'::jsonb,
    55990000, 'ACTIVE'
),

-- 12. HP EliteBook 840 G10
(
    'https://example.com/images/hp-elitebook-840-g10-main.jpg',
    ARRAY['https://example.com/images/hp-elitebook-840-g10-1.jpg','https://example.com/images/hp-elitebook-840-g10-2.jpg','https://example.com/images/hp-elitebook-840-g10-3.jpg'],
    'HP EliteBook 840 G10',
    'Laptop doanh nghiệp HP EliteBook 840 G10 với bảo mật đa lớp, màn hình Sure View chống nhìn trộm, chuẩn quân sự.',
    'hp-elitebook-840-g10',
    '{
        "Hệ điều hành": "Windows 11 Pro",
        "Bộ xử lý": "Intel Core i7-1355U vPro",
        "Tốc độ CPU": "1.7 GHz (Turbo 5.0 GHz)",
        "RAM": "16 GB LPDDR5",
        "Ổ cứng": "512 GB NVMe SSD Opal 2",
        "Màn hình": "14 inch IPS FHD 1920x1080, Sure View Gen4 chống nhìn trộm",
        "Card đồ họa": "Intel Iris Xe Graphics",
        "Bảo mật": "HP Wolf Security, Sure Start, TPM 2.0, vân tay, IR Camera",
        "Pin": "51 Whr, sạc nhanh SuperFast 65W, lên đến 10 giờ",
        "Cổng kết nối": "2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.0, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.38 kg",
        "Chuẩn bền": "MIL-STD-810H",
        "Bảo hành": "36 tháng HP"
    }'::jsonb,
    32990000, 'ACTIVE'
),

-- 13. Gigabyte AORUS 15 BKF
(
    'https://example.com/images/gigabyte-aorus-15-main.jpg',
    ARRAY['https://example.com/images/gigabyte-aorus-15-1.jpg','https://example.com/images/gigabyte-aorus-15-2.jpg','https://example.com/images/gigabyte-aorus-15-3.jpg'],
    'Gigabyte AORUS 15 BKF Gaming 2023',
    'Laptop gaming Gigabyte AORUS 15 màn hình QHD 165Hz, RTX 4070, tản nhiệt Windforce Infinity hiệu quả cao.',
    'gigabyte-aorus-15-bkf-2023',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i7-13700H",
        "Tốc độ CPU": "2.4 GHz (Turbo 5.0 GHz)",
        "RAM": "16 GB DDR5 4800MHz (nâng cấp tối đa 64 GB)",
        "Ổ cứng": "1 TB NVMe SSD PCIe 4.0",
        "Màn hình": "15.6 inch QHD 2560x1440, 165Hz, IPS, 100% sRGB",
        "Card đồ họa": "NVIDIA GeForce RTX 4070 8 GB GDDR6",
        "Hệ thống làm mát": "Windforce Infinity, 2 quạt 12V",
        "Pin": "99.9 Whr, Adapter 280W",
        "Cổng kết nối": "1x Thunderbolt 4, 2x USB-A 3.2, 1x USB-C 3.2, HDMI 2.1, miniDP 1.4, SD Card, RJ45",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.2",
        "Trọng lượng": "2.4 kg",
        "Bàn phím": "RGB 4 vùng, N-Key Rollover",
        "Bảo hành": "24 tháng chính hãng Gigabyte"
    }'::jsonb,
    42990000, 'ACTIVE'
),

-- 14. Microsoft Surface Laptop 5
(
    'https://example.com/images/surface-laptop-5-main.jpg',
    ARRAY['https://example.com/images/surface-laptop-5-1.jpg','https://example.com/images/surface-laptop-5-2.jpg','https://example.com/images/surface-laptop-5-3.jpg'],
    'Microsoft Surface Laptop 5 13.5 inch',
    'Laptop cao cấp Microsoft Surface Laptop 5 thiết kế mỏng nhẹ, màn hình PixelSense cảm ứng, Dolby Atmos.',
    'microsoft-surface-laptop-5-13',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i5-1245U",
        "Tốc độ CPU": "1.6 GHz (Turbo 4.4 GHz)",
        "RAM": "16 GB LPDDR5x",
        "Ổ cứng": "512 GB NVMe SSD",
        "Màn hình": "13.5 inch PixelSense 2256x1504, cảm ứng 10 điểm, 60Hz",
        "Card đồ họa": "Intel Iris Xe Graphics",
        "Âm thanh": "Omnisonic Speakers với Dolby Atmos",
        "Pin": "47.4 Whr, lên đến 18 giờ, sạc nhanh",
        "Cổng kết nối": "1x Thunderbolt 4, 1x USB-A 3.1, Surface Connect, Audio",
        "Wi-Fi": "Wi-Fi 6 (802.11ax)",
        "Bluetooth": "Bluetooth 5.1",
        "Trọng lượng": "1.29 kg",
        "Màu sắc": "Sandstone",
        "Bảo hành": "12 tháng Microsoft"
    }'::jsonb,
    28990000, 'ACTIVE'
),

-- 15. ASUS TUF Gaming A15
(
    'https://example.com/images/asus-tuf-a15-main.jpg',
    ARRAY['https://example.com/images/asus-tuf-a15-1.jpg','https://example.com/images/asus-tuf-a15-2.jpg','https://example.com/images/asus-tuf-a15-3.jpg'],
    'ASUS TUF Gaming A15 FA507NV',
    'Laptop gaming tầm trung ASUS TUF A15 bền bỉ MIL-SPEC, Ryzen 7, RTX 4060, pin 90Whr trâu.',
    'asus-tuf-gaming-a15-fa507nv',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "AMD Ryzen 7 7745HX",
        "Tốc độ CPU": "3.6 GHz (Turbo 5.1 GHz), 8 nhân 16 luồng",
        "RAM": "16 GB DDR5 4800MHz",
        "Ổ cứng": "512 GB NVMe SSD PCIe 4.0",
        "Màn hình": "15.6 inch FHD 1920x1080, 144Hz, IPS",
        "Card đồ họa": "NVIDIA GeForce RTX 4060 8 GB GDDR6",
        "Hệ thống làm mát": "TUF Thermal System, 4 ống đồng",
        "Pin": "90 Whr, Adapter 240W",
        "Cổng kết nối": "1x USB-C 3.2, 1x USB-A 3.2 Gen2, 2x USB-A 3.2 Gen1, HDMI 2.1, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 6 (802.11ax)",
        "Bluetooth": "Bluetooth 5.0",
        "Trọng lượng": "2.2 kg",
        "Chuẩn bền": "MIL-STD-810H",
        "Bảo hành": "24 tháng ASUS"
    }'::jsonb,
    27490000, 'ACTIVE'
),

-- 16. MacBook Air M2
(
    'https://example.com/images/macbook-air-m2-main.jpg',
    ARRAY['https://example.com/images/macbook-air-m2-1.jpg','https://example.com/images/macbook-air-m2-2.jpg','https://example.com/images/macbook-air-m2-3.jpg'],
    'Apple MacBook Air 13 inch M2',
    'MacBook Air M2 không quạt siêu yên tĩnh, thiết kế hoàn toàn mới, màn hình Liquid Retina 13.6 inch sắc nét.',
    'apple-macbook-air-13-m2',
    '{
        "Hệ điều hành": "macOS Sonoma",
        "Chip": "Apple M2 (8-core CPU, 8-core GPU)",
        "RAM": "8 GB Unified Memory",
        "Ổ cứng": "256 GB SSD",
        "Màn hình": "13.6 inch Liquid Retina 2560x1664, 500 nits, True Tone",
        "Camera": "1080p FaceTime HD",
        "Pin": "52.6 Whr, lên đến 18 giờ, MagSafe 30W",
        "Cổng kết nối": "2x Thunderbolt / USB 4, MagSafe 3, Audio 3.5mm",
        "Wi-Fi": "Wi-Fi 6 (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.24 kg",
        "Độ mỏng": "11.3 mm",
        "Màu sắc": "Midnight",
        "Bảo hành": "12 tháng Apple"
    }'::jsonb,
    27990000, 'ACTIVE'
),

-- 17. Lenovo Legion 5 Pro
(
    'https://example.com/images/lenovo-legion-5-pro-main.jpg',
    ARRAY['https://example.com/images/lenovo-legion-5-pro-1.jpg','https://example.com/images/lenovo-legion-5-pro-2.jpg','https://example.com/images/lenovo-legion-5-pro-3.jpg'],
    'Lenovo Legion 5 Pro Gen 8 AMD',
    'Laptop gaming Lenovo Legion 5 Pro màn hình 16 inch 165Hz 100% sRGB, AMD Ryzen 9, RTX 4070 mạnh mẽ.',
    'lenovo-legion-5-pro-gen8-amd',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "AMD Ryzen 9 7945HX",
        "Tốc độ CPU": "2.5 GHz (Turbo 5.4 GHz), 16 nhân 32 luồng",
        "RAM": "32 GB DDR5 4800MHz (2 khe)",
        "Ổ cứng": "1 TB NVMe SSD PCIe 4.0",
        "Màn hình": "16 inch IPS 2560x1600, 165Hz, 100% sRGB, 500 nits",
        "Card đồ họa": "NVIDIA GeForce RTX 4070 8 GB GDDR6",
        "Hệ thống làm mát": "Legion Coldfront 5.0, 2 quạt",
        "Pin": "80 Whr, Adapter 300W",
        "Cổng kết nối": "1x Thunderbolt 4, 4x USB-A 3.2, 1x USB-C 3.2, HDMI 2.1, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.1",
        "Trọng lượng": "2.4 kg",
        "Bàn phím": "RGB 4 vùng TrueStrike",
        "Bảo hành": "24 tháng Lenovo"
    }'::jsonb,
    44990000, 'ACTIVE'
),

-- 18. HP Victus 15
(
    'https://example.com/images/hp-victus-15-main.jpg',
    ARRAY['https://example.com/images/hp-victus-15-1.jpg','https://example.com/images/hp-victus-15-2.jpg','https://example.com/images/hp-victus-15-3.jpg'],
    'HP Victus 15 Gaming fa1055TX',
    'Laptop gaming tầm trung HP Victus 15, thiết kế thời trang, RTX 4060, màn hình FHD 144Hz mượt mà.',
    'hp-victus-15-fa1055tx',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core i5-12450H",
        "Tốc độ CPU": "2.0 GHz (Turbo 4.4 GHz)",
        "RAM": "8 GB DDR4 3200MHz (nâng cấp tối đa 32 GB)",
        "Ổ cứng": "512 GB NVMe SSD PCIe 4.0",
        "Màn hình": "15.6 inch FHD 1920x1080, 144Hz, IPS, 250 nits",
        "Card đồ họa": "NVIDIA GeForce RTX 4060 8 GB GDDR6",
        "Webcam": "720p HP Wide Vision",
        "Pin": "70.9 Whr, Adapter 230W",
        "Cổng kết nối": "1x USB-C 3.2, 2x USB-A 3.2, 1x USB-A 2.0, HDMI 2.1, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 6 (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "2.37 kg",
        "Bảo hành": "12 tháng HP"
    }'::jsonb,
    22990000, 'ACTIVE'
),

-- 19. Acer Nitro 16
(
    'https://example.com/images/acer-nitro-16-main.jpg',
    ARRAY['https://example.com/images/acer-nitro-16-1.jpg','https://example.com/images/acer-nitro-16-2.jpg','https://example.com/images/acer-nitro-16-3.jpg'],
    'Acer Nitro 16 AN16-41 Gaming',
    'Laptop gaming Acer Nitro 16 màn hình lớn 16 inch WUXGA, chip AMD Ryzen mới, RTX 4060, giá thành hợp lý.',
    'acer-nitro-16-an16-41',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "AMD Ryzen 5 7535HS",
        "Tốc độ CPU": "3.3 GHz (Turbo 4.55 GHz), 6 nhân 12 luồng",
        "RAM": "16 GB DDR5 4800MHz",
        "Ổ cứng": "512 GB NVMe SSD PCIe 4.0",
        "Màn hình": "16 inch IPS WUXGA 1920x1200, 165Hz, 100% sRGB",
        "Card đồ họa": "NVIDIA GeForce RTX 4060 8 GB GDDR6",
        "Hệ thống làm mát": "Dual Fan, 4 ống đồng, khe thoát nhiệt 4 chiều",
        "Pin": "90 Whr, Adapter 230W",
        "Cổng kết nối": "1x USB-C 3.2, 2x USB-A 3.2, 1x USB-A 2.0, HDMI 2.1, RJ45, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.1",
        "Trọng lượng": "2.5 kg",
        "Bàn phím": "RGB 4 vùng",
        "Bảo hành": "24 tháng Acer"
    }'::jsonb,
    24990000, 'ACTIVE'
),

-- 20. Samsung Galaxy Book4 Pro
(
    'https://example.com/images/samsung-galaxy-book4-pro-main.jpg',
    ARRAY['https://example.com/images/samsung-galaxy-book4-pro-1.jpg','https://example.com/images/samsung-galaxy-book4-pro-2.jpg','https://example.com/images/samsung-galaxy-book4-pro-3.jpg'],
    'Samsung Galaxy Book4 Pro 16 inch',
    'Laptop cao cấp Samsung Galaxy Book4 Pro màn hình Dynamic AMOLED 2X 3K 120Hz, Intel Core Ultra 7, tích hợp AI.',
    'samsung-galaxy-book4-pro-16',
    '{
        "Hệ điều hành": "Windows 11 Home",
        "Bộ xử lý": "Intel Core Ultra 7 155H",
        "Tốc độ CPU": "1.4 GHz (Turbo 4.8 GHz)",
        "RAM": "16 GB LPDDR5x",
        "Ổ cứng": "512 GB NVMe SSD",
        "Màn hình": "16 inch Dynamic AMOLED 2X 2880x1800, 120Hz, 500 nits, HDR",
        "Card đồ họa": "Intel Arc Graphics",
        "Tính năng AI": "Galaxy AI, Live Translate, Note Assist",
        "Pin": "76 Whr, lên đến 22 giờ, sạc nhanh 65W",
        "Cổng kết nối": "2x Thunderbolt 4, 1x USB-C 3.2, 1x USB-A 3.2, HDMI 2.1, microSD, Audio",
        "Wi-Fi": "Wi-Fi 6E (802.11ax)",
        "Bluetooth": "Bluetooth 5.3",
        "Trọng lượng": "1.55 kg",
        "Màu sắc": "Moonstone Gray",
        "Bảo hành": "12 tháng Samsung"
    }'::jsonb,
    34990000, 'ACTIVE'
);


-- =============================================
-- INSERT 20 KHO TƯƠNG ỨNG
-- =============================================
INSERT INTO inventories (stock_quantity, reserved_quantity, product_id)
SELECT 50, 0, id FROM products WHERE slug = 'dell-xps-15-9530'
UNION ALL
SELECT 30, 0, id FROM products WHERE slug = 'apple-macbook-pro-14-m3-pro'
UNION ALL
SELECT 45, 0, id FROM products WHERE slug = 'asus-rog-strix-g16-2024'
UNION ALL
SELECT 25, 0, id FROM products WHERE slug = 'lenovo-thinkpad-x1-carbon-gen11'
UNION ALL
SELECT 40, 0, id FROM products WHERE slug = 'hp-spectre-x360-14-oled'
UNION ALL
SELECT 100, 0, id FROM products WHERE slug = 'acer-aspire-5-a515-58m'
UNION ALL
SELECT 10, 0, id FROM products WHERE slug = 'msi-titan-gt77-hx-13vi'
UNION ALL
SELECT 80, 0, id FROM products WHERE slug = 'lenovo-ideapad-slim5-16abr8'
UNION ALL
SELECT 60, 0, id FROM products WHERE slug = 'asus-zenbook-14-oled-ux3405ma'
UNION ALL
SELECT 120, 0, id FROM products WHERE slug = 'dell-inspiron-15-3520'
UNION ALL
SELECT 20, 0, id FROM products WHERE slug = 'razer-blade-15-2024'
UNION ALL
SELECT 35, 0, id FROM products WHERE slug = 'hp-elitebook-840-g10'
UNION ALL
SELECT 55, 0, id FROM products WHERE slug = 'gigabyte-aorus-15-bkf-2023'
UNION ALL
SELECT 45, 0, id FROM products WHERE slug = 'microsoft-surface-laptop-5-13'
UNION ALL
SELECT 70, 0, id FROM products WHERE slug = 'asus-tuf-gaming-a15-fa507nv'
UNION ALL
SELECT 90, 0, id FROM products WHERE slug = 'apple-macbook-air-13-m2'
UNION ALL
SELECT 50, 0, id FROM products WHERE slug = 'lenovo-legion-5-pro-gen8-amd'
UNION ALL
SELECT 85, 0, id FROM products WHERE slug = 'hp-victus-15-fa1055tx'
UNION ALL
SELECT 75, 0, id FROM products WHERE slug = 'acer-nitro-16-an16-41'
UNION ALL
SELECT 40, 0, id FROM products WHERE slug = 'samsung-galaxy-book4-pro-16';