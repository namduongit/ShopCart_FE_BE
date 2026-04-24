INSERT INTO products (
    main_image_url,
    image_urls,
    name,
    slug,
    stock_quantity,
    reserved_stock_quantity,
    attributes,
    price,
    status
) VALUES

-- 1. MacBook Pro 16
(
    'https://images.example.com/macbook-pro-16-main.jpg',
    ARRAY['https://images.example.com/macbook-pro-16-1.jpg','https://images.example.com/macbook-pro-16-2.jpg','https://images.example.com/macbook-pro-16-3.jpg'],
    'Apple MacBook Pro 16 inch M3 Pro 2024',
    'apple-macbook-pro-16-m3-pro-2024',
    30, 5,
    '{"brand":"Apple","cpu":"Apple M3 Pro","ram":"18GB","storage":"512GB SSD","display":"16.2 inch Liquid Retina XDR","os":"macOS Sonoma","color":"Space Black","weight":"2.14kg","battery":"22 hours","gpu":"18-core GPU"}'::jsonb,
    74990000, 'ACTIVE'
),

-- 2. Dell XPS 15
(
    'https://images.example.com/dell-xps-15-main.jpg',
    ARRAY['https://images.example.com/dell-xps-15-1.jpg','https://images.example.com/dell-xps-15-2.jpg'],
    'Dell XPS 15 9530 Intel Core i7 13th Gen',
    'dell-xps-15-9530-i7-13th-gen',
    25, 3,
    '{"brand":"Dell","cpu":"Intel Core i7-13700H","ram":"16GB DDR5","storage":"512GB NVMe SSD","display":"15.6 inch OLED 3.5K","os":"Windows 11 Home","color":"Platinum Silver","weight":"1.86kg","gpu":"NVIDIA RTX 4060 6GB"}'::jsonb,
    52990000, 'ACTIVE'
),

-- 3. ASUS ROG Strix G16
(
    'https://images.example.com/asus-rog-strix-g16-main.jpg',
    ARRAY['https://images.example.com/asus-rog-strix-g16-1.jpg','https://images.example.com/asus-rog-strix-g16-2.jpg','https://images.example.com/asus-rog-strix-g16-3.jpg'],
    'ASUS ROG Strix G16 G614JV Gaming Laptop',
    'asus-rog-strix-g16-g614jv-gaming',
    40, 8,
    '{"brand":"ASUS","cpu":"Intel Core i7-13650HX","ram":"16GB DDR5","storage":"1TB NVMe SSD","display":"16 inch FHD 165Hz","os":"Windows 11 Home","color":"Eclipse Gray","weight":"2.5kg","gpu":"NVIDIA RTX 4060 8GB","keyboard":"RGB Backlit"}'::jsonb,
    32990000, 'ACTIVE'
),

-- 4. Lenovo ThinkPad X1 Carbon
(
    'https://images.example.com/thinkpad-x1-carbon-main.jpg',
    ARRAY['https://images.example.com/thinkpad-x1-carbon-1.jpg','https://images.example.com/thinkpad-x1-carbon-2.jpg'],
    'Lenovo ThinkPad X1 Carbon Gen 11',
    'lenovo-thinkpad-x1-carbon-gen-11',
    20, 2,
    '{"brand":"Lenovo","cpu":"Intel Core i7-1365U","ram":"16GB LPDDR5","storage":"512GB SSD","display":"14 inch IPS 2.8K","os":"Windows 11 Pro","color":"Deep Black","weight":"1.12kg","battery":"15 hours","fingerprint":true}'::jsonb,
    45990000, 'ACTIVE'
),

-- 5. HP Spectre x360
(
    'https://images.example.com/hp-spectre-x360-main.jpg',
    ARRAY['https://images.example.com/hp-spectre-x360-1.jpg','https://images.example.com/hp-spectre-x360-2.jpg'],
    'HP Spectre x360 14 inch 2-in-1 Laptop',
    'hp-spectre-x360-14-2in1',
    15, 1,
    '{"brand":"HP","cpu":"Intel Core Ultra 7 155H","ram":"16GB LPDDR5x","storage":"1TB SSD","display":"14 inch 2.8K OLED Touch","os":"Windows 11 Home","color":"Nightfall Black","weight":"1.58kg","type":"2-in-1 Convertible","stylus":true}'::jsonb,
    38990000, 'ACTIVE'
),

-- 6. Acer Swift 3
(
    'https://images.example.com/acer-swift-3-main.jpg',
    ARRAY['https://images.example.com/acer-swift-3-1.jpg','https://images.example.com/acer-swift-3-2.jpg'],
    'Acer Swift 3 SF314 AMD Ryzen 5 7530U',
    'acer-swift-3-sf314-ryzen5-7530u',
    50, 4,
    '{"brand":"Acer","cpu":"AMD Ryzen 5 7530U","ram":"8GB LPDDR4x","storage":"512GB NVMe SSD","display":"14 inch FHD IPS","os":"Windows 11 Home","color":"Pure Silver","weight":"1.25kg","battery":"10 hours"}'::jsonb,
    14990000, 'ACTIVE'
),

-- 7. MSI Titan GT77
(
    'https://images.example.com/msi-titan-gt77-main.jpg',
    ARRAY['https://images.example.com/msi-titan-gt77-1.jpg','https://images.example.com/msi-titan-gt77-2.jpg','https://images.example.com/msi-titan-gt77-3.jpg'],
    'MSI Titan GT77 HX 13V Gaming Laptop',
    'msi-titan-gt77-hx-13v-gaming',
    10, 2,
    '{"brand":"MSI","cpu":"Intel Core i9-13980HX","ram":"64GB DDR5","storage":"2TB NVMe SSD","display":"17.3 inch UHD 144Hz","os":"Windows 11 Pro","color":"Black Titanium","weight":"3.3kg","gpu":"NVIDIA RTX 4090 16GB","keyboard":"Per-key RGB"}'::jsonb,
    109990000, 'ACTIVE'
),

-- 8. MacBook Air M2
(
    'https://images.example.com/macbook-air-m2-main.jpg',
    ARRAY['https://images.example.com/macbook-air-m2-1.jpg','https://images.example.com/macbook-air-m2-2.jpg'],
    'Apple MacBook Air 13 inch M2 2023',
    'apple-macbook-air-13-m2-2023',
    60, 10,
    '{"brand":"Apple","cpu":"Apple M2","ram":"8GB","storage":"256GB SSD","display":"13.6 inch Liquid Retina","os":"macOS Sonoma","color":"Midnight","weight":"1.24kg","battery":"18 hours","gpu":"8-core GPU"}'::jsonb,
    28990000, 'ACTIVE'
),

-- 9. Dell Alienware m18
(
    'https://images.example.com/alienware-m18-main.jpg',
    ARRAY['https://images.example.com/alienware-m18-1.jpg','https://images.example.com/alienware-m18-2.jpg'],
    'Dell Alienware m18 R2 Gaming Laptop',
    'dell-alienware-m18-r2-gaming',
    8, 1,
    '{"brand":"Dell","cpu":"Intel Core i9-14900HX","ram":"32GB DDR5","storage":"1TB NVMe SSD","display":"18 inch QHD+ 165Hz","os":"Windows 11 Home","color":"Dark Metallic Moon","weight":"4.2kg","gpu":"NVIDIA RTX 4080 12GB","cherry_mx_keyboard":true}'::jsonb,
    89990000, 'ACTIVE'
),

-- 10. Lenovo IdeaPad 5
(
    'https://images.example.com/lenovo-ideapad-5-main.jpg',
    ARRAY['https://images.example.com/lenovo-ideapad-5-1.jpg','https://images.example.com/lenovo-ideapad-5-2.jpg'],
    'Lenovo IdeaPad 5 15 AMD Ryzen 7 7730U',
    'lenovo-ideapad-5-15-ryzen7-7730u',
    45, 6,
    '{"brand":"Lenovo","cpu":"AMD Ryzen 7 7730U","ram":"16GB DDR4","storage":"512GB SSD","display":"15.6 inch FHD IPS","os":"Windows 11 Home","color":"Abyss Blue","weight":"1.67kg","battery":"12 hours"}'::jsonb,
    17990000, 'ACTIVE'
),

-- 11. ASUS ZenBook Pro Duo
(
    'https://images.example.com/asus-zenbook-pro-duo-main.jpg',
    ARRAY['https://images.example.com/asus-zenbook-pro-duo-1.jpg','https://images.example.com/asus-zenbook-pro-duo-2.jpg'],
    'ASUS ZenBook Pro Duo 14 OLED UX8402',
    'asus-zenbook-pro-duo-14-oled-ux8402',
    12, 2,
    '{"brand":"ASUS","cpu":"Intel Core i7-13700H","ram":"16GB LPDDR5","storage":"1TB SSD","display":"14.5 inch 2.8K OLED Touch + ScreenPad Plus","os":"Windows 11 Pro","color":"Tech Black","weight":"1.75kg","gpu":"NVIDIA RTX 4060 8GB","dual_screen":true}'::jsonb,
    49990000, 'ACTIVE'
),

-- 12. Razer Blade 15
(
    'https://images.example.com/razer-blade-15-main.jpg',
    ARRAY['https://images.example.com/razer-blade-15-1.jpg','https://images.example.com/razer-blade-15-2.jpg','https://images.example.com/razer-blade-15-3.jpg'],
    'Razer Blade 15 Gaming Laptop 2024',
    'razer-blade-15-gaming-2024',
    18, 3,
    '{"brand":"Razer","cpu":"Intel Core i7-13800H","ram":"16GB DDR5","storage":"1TB NVMe SSD","display":"15.6 inch QHD 240Hz","os":"Windows 11 Home","color":"Black","weight":"2.01kg","gpu":"NVIDIA RTX 4070 8GB","keyboard":"Per-key RGB Razer Chroma"}'::jsonb,
    64990000, 'ACTIVE'
),

-- 13. Samsung Galaxy Book4 Pro
(
    'https://images.example.com/samsung-galaxy-book4-pro-main.jpg',
    ARRAY['https://images.example.com/samsung-galaxy-book4-pro-1.jpg','https://images.example.com/samsung-galaxy-book4-pro-2.jpg'],
    'Samsung Galaxy Book4 Pro 16 inch',
    'samsung-galaxy-book4-pro-16',
    22, 3,
    '{"brand":"Samsung","cpu":"Intel Core Ultra 7 155H","ram":"16GB LPDDR5x","storage":"512GB NVMe SSD","display":"16 inch Dynamic AMOLED 2X 2880x1800","os":"Windows 11 Home","color":"Moonstone Gray","weight":"1.56kg","battery":"76Wh"}'::jsonb,
    36990000, 'ACTIVE'
),

-- 14. Gigabyte AORUS 15
(
    'https://images.example.com/gigabyte-aorus-15-main.jpg',
    ARRAY['https://images.example.com/gigabyte-aorus-15-1.jpg','https://images.example.com/gigabyte-aorus-15-2.jpg'],
    'Gigabyte AORUS 15 BKF Gaming Laptop',
    'gigabyte-aorus-15-bkf-gaming',
    20, 4,
    '{"brand":"Gigabyte","cpu":"Intel Core i7-13700H","ram":"16GB DDR5","storage":"1TB NVMe SSD","display":"15.6 inch FHD IPS 360Hz","os":"Windows 11 Home","color":"Black","weight":"2.4kg","gpu":"NVIDIA RTX 4070 8GB","mux_switch":true}'::jsonb,
    39990000, 'ACTIVE'
),

-- 15. Microsoft Surface Laptop 5
(
    'https://images.example.com/surface-laptop-5-main.jpg',
    ARRAY['https://images.example.com/surface-laptop-5-1.jpg','https://images.example.com/surface-laptop-5-2.jpg'],
    'Microsoft Surface Laptop 5 13.5 inch',
    'microsoft-surface-laptop-5-13-inch',
    28, 2,
    '{"brand":"Microsoft","cpu":"Intel Core i5-1245U","ram":"8GB LPDDR5x","storage":"512GB SSD","display":"13.5 inch PixelSense Touch 2256x1504","os":"Windows 11 Home","color":"Sage","weight":"1.29kg","battery":"18 hours"}'::jsonb,
    29990000, 'ACTIVE'
),

-- 16. HP Pavilion 15
(
    'https://images.example.com/hp-pavilion-15-main.jpg',
    ARRAY['https://images.example.com/hp-pavilion-15-1.jpg','https://images.example.com/hp-pavilion-15-2.jpg'],
    'HP Pavilion 15 AMD Ryzen 5 7520U',
    'hp-pavilion-15-ryzen5-7520u',
    70, 9,
    '{"brand":"HP","cpu":"AMD Ryzen 5 7520U","ram":"8GB DDR4","storage":"256GB SSD","display":"15.6 inch FHD IPS Anti-glare","os":"Windows 11 Home","color":"Natural Silver","weight":"1.75kg","battery":"8.5 hours"}'::jsonb,
    11990000, 'ACTIVE'
),

-- 17. LG Gram 17
(
    'https://images.example.com/lg-gram-17-main.jpg',
    ARRAY['https://images.example.com/lg-gram-17-1.jpg','https://images.example.com/lg-gram-17-2.jpg'],
    'LG Gram 17 2024 Intel Core Ultra 7',
    'lg-gram-17-2024-core-ultra-7',
    16, 1,
    '{"brand":"LG","cpu":"Intel Core Ultra 7 155H","ram":"16GB LPDDR5","storage":"512GB NVMe SSD","display":"17 inch WQXGA IPS Anti-glare","os":"Windows 11 Home","color":"White","weight":"1.35kg","battery":"80Wh","mil_spec":true}'::jsonb,
    42990000, 'ACTIVE'
),

-- 18. Xiaomi Mi Notebook Pro 14
(
    'https://images.example.com/xiaomi-notebook-pro-14-main.jpg',
    ARRAY['https://images.example.com/xiaomi-notebook-pro-14-1.jpg','https://images.example.com/xiaomi-notebook-pro-14-2.jpg'],
    'Xiaomi Mi Notebook Pro 14 Intel Core i5',
    'xiaomi-mi-notebook-pro-14-i5',
    35, 5,
    '{"brand":"Xiaomi","cpu":"Intel Core i5-12450H","ram":"16GB LPDDR5","storage":"512GB SSD","display":"14 inch 2.5K IPS 120Hz","os":"Windows 11 Home","color":"Gray","weight":"1.4kg","gpu":"NVIDIA MX550 2GB","fingerprint":true}'::jsonb,
    19990000, 'ACTIVE'
),

-- 19. Asus TUF Gaming F15
(
    'https://images.example.com/asus-tuf-f15-main.jpg',
    ARRAY['https://images.example.com/asus-tuf-f15-1.jpg','https://images.example.com/asus-tuf-f15-2.jpg','https://images.example.com/asus-tuf-f15-3.jpg'],
    'ASUS TUF Gaming F15 FX507VV4',
    'asus-tuf-gaming-f15-fx507vv4',
    55, 7,
    '{"brand":"ASUS","cpu":"Intel Core i7-13700H","ram":"16GB DDR4","storage":"512GB NVMe SSD","display":"15.6 inch FHD IPS 144Hz","os":"Windows 11 Home","color":"Jaeger Gray","weight":"2.2kg","gpu":"NVIDIA RTX 4060 8GB","mil_spec":true}'::jsonb,
    26990000, 'ACTIVE'
),

-- 20. Lenovo Legion 5 Pro
(
    'https://images.example.com/lenovo-legion-5-pro-main.jpg',
    ARRAY['https://images.example.com/lenovo-legion-5-pro-1.jpg','https://images.example.com/lenovo-legion-5-pro-2.jpg','https://images.example.com/lenovo-legion-5-pro-3.jpg'],
    'Lenovo Legion 5 Pro 16 AMD Ryzen 9',
    'lenovo-legion-5-pro-16-ryzen9',
    33, 6,
    '{"brand":"Lenovo","cpu":"AMD Ryzen 9 7945HX","ram":"32GB DDR5","storage":"1TB NVMe SSD","display":"16 inch 2560x1600 IPS 240Hz","os":"Windows 11 Home","color":"Storm Grey","weight":"2.4kg","gpu":"NVIDIA RTX 4070 8GB","mux_switch":true}'::jsonb,
    44990000, 'ACTIVE'
);