-- Update products table with new product names, prices, and data
-- Run this in your Supabase SQL Editor

-- Product 1: Air Zoom Pegasus 40
UPDATE public.products SET
    name = 'Air Zoom Pegasus 40',
    price = 130,
    original_price = NULL,
    rating = 5,
    review_count = 124,
    description = 'The latest Pegasus with responsive ZoomX foam for an energized ride.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Product 2: Ultraboost Light
UPDATE public.products SET
    name = 'Ultraboost Light',
    price = 190,
    original_price = NULL,
    rating = 5,
    review_count = 89,
    description = '30% lighter than previous Ultraboost. Maximum energy return.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000002';

-- Product 3: Fresh Foam X 1080v13
UPDATE public.products SET
    name = 'Fresh Foam X 1080v13',
    price = 165,
    original_price = NULL,
    rating = 4.5,
    review_count = 67,
    description = 'Plush comfort meets responsive performance. Your everyday essential.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000003';

-- Product 4: Gel-Kayano 30
UPDATE public.products SET
    name = 'Gel-Kayano 30',
    price = 140,
    original_price = 180,
    rating = 4,
    review_count = 156,
    description = '30th anniversary edition with enhanced stability technology.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000004';

-- Product 5: Cloud X 4
UPDATE public.products SET
    name = 'Cloud X 4',
    price = 150,
    original_price = NULL,
    rating = 5,
    review_count = 203,
    description = 'Versatile training shoe for gym sessions and short runs.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000005';

-- Product 6: Novablast 4
UPDATE public.products SET
    name = 'Novablast 4',
    price = 115,
    original_price = 140,
    rating = 4.5,
    review_count = 92,
    description = 'Bouncy FF Blast+ cushioning for a fun, energetic ride.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000006';

-- Product 7: Pegasus Trail 4
UPDATE public.products SET
    name = 'Pegasus Trail 4',
    price = 145,
    original_price = NULL,
    rating = 4.5,
    review_count = 78,
    description = 'Trail-ready traction with road-shoe comfort. Go anywhere.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000007';

-- Product 8: Glycerin 21
UPDATE public.products SET
    name = 'Glycerin 21',
    price = 130,
    original_price = 160,
    rating = 5,
    review_count = 187,
    description = 'DNA LOFT v3 cushioning delivers a soft, smooth ride.',
    category = 'new-arrivals'
WHERE id = '00000000-0000-0000-0000-000000000008';

-- Product 9: Air Max 90
UPDATE public.products SET
    name = 'Air Max 90',
    price = 130,
    original_price = NULL,
    rating = 5,
    review_count = 1247,
    description = 'The icon returns. Visible Air cushioning since 1990.',
    category = 'trending',
    image = '/images/products/cosmic-unity.svg'
WHERE id = '00000000-0000-0000-0000-000000000009';

-- Product 10: 574 Core
UPDATE public.products SET
    name = '574 Core',
    price = 90,
    original_price = NULL,
    rating = 4.5,
    review_count = 2341,
    description = 'Classic heritage style meets modern comfort. An icon.',
    category = 'trending',
    image = '/images/products/air-zoom-pegasus-37.svg'
WHERE id = '00000000-0000-0000-0000-000000000010';

-- Product 11: Cloudmonster
UPDATE public.products SET
    name = 'Cloudmonster',
    price = 170,
    original_price = NULL,
    rating = 5,
    review_count = 892,
    description = 'Maximum cushioning, monster energy return. Go big.',
    category = 'trending',
    image = '/images/products/Maroon.svg'
WHERE id = '00000000-0000-0000-0000-000000000011';

-- Product 12: Gel-Nimbus 25
UPDATE public.products SET
    name = 'Gel-Nimbus 25',
    price = 135,
    original_price = 160,
    rating = 4.5,
    review_count = 567,
    description = 'Pure comfort for long-distance runners. A best-seller.',
    category = 'trending',
    image = '/images/products/air-max-90-flyease.svg'
WHERE id = '00000000-0000-0000-0000-000000000012';

-- Product 13: Vaporfly 3
UPDATE public.products SET
    name = 'Vaporfly 3',
    price = 250,
    original_price = NULL,
    rating = 5,
    review_count = 423,
    description = 'The record-breaking racing shoe. Elite performance.',
    category = 'trending',
    image = '/images/products/Maroon.svg'
WHERE id = '00000000-0000-0000-0000-000000000013';

-- Product 14: Saucony Kinvara 14
UPDATE public.products SET
    name = 'Saucony Kinvara 14',
    price = 120,
    original_price = NULL,
    rating = 4.5,
    review_count = 634,
    description = 'Lightweight and fast. Perfect for tempo runs.',
    category = 'trending',
    image = '/images/products/air-max-90-flyease.svg'
WHERE id = '00000000-0000-0000-0000-000000000014';

-- Product 15: Ghost 15
UPDATE public.products SET
    name = 'Ghost 15',
    price = 110,
    original_price = 140,
    rating = 5,
    review_count = 1823,
    description = 'Smooth transitions, soft cushioning. A runner favorite.',
    category = 'trending',
    image = '/images/products/air-zoom-pegasus-37.svg'
WHERE id = '00000000-0000-0000-0000-000000000015';

-- Product 16: Hoka Bondi 8
UPDATE public.products SET
    name = 'Hoka Bondi 8',
    price = 165,
    original_price = NULL,
    rating = 5,
    review_count = 1456,
    description = 'Ultra-cushioned comfort for all-day wear. Fan favorite.',
    category = 'trending',
    image = '/images/products/cosmic-unity.svg'
WHERE id = '00000000-0000-0000-0000-000000000016';
