-- Thêm sản phẩm giá dưới 10 triệu
WITH inserted_product AS (
    INSERT INTO products (
        main_image_url,
        image_urls,
        name,
        description,
        slug,
        attributes,
        price,
        status
    ) VALUES (
        'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-main.png',
        ARRAY[
            'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-1.png',
            'https://cdn2.cellphones.com.vn/x/media/catalog/product/l/o/logitech-mx-master-3s-2.png'
        ],
        'Logitech MX Master 3S',
        'Chuột không dây cao cấp Logitech MX Master 3S - độ chính xác 8000 DPI, kết nối Bluetooth & USB, pin 70 ngày.',
        'logitech-mx-master-3s',
        '{"brand": "Logitech", "connectivity": "Bluetooth/USB", "dpi": "8000", "battery": "70 days"}'::jsonb,
        1590000,
        'ACTIVE'
    )
    RETURNING id
)
INSERT INTO inventories (stock_quantity, product_id)
SELECT 50, id FROM inserted_product;
