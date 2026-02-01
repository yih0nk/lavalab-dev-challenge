-- Fix all product images and data
-- Run this in your Supabase SQL Editor

-- NEW ARRIVALS (Products 1-8)
-- Row 1: White, Red, Blue, Green

UPDATE public.products SET
    name = 'Air Zoom Pegasus 40',
    price = 130,
    original_price = NULL,
    rating = 5,
    image = '/images/products/air-zoom-pegasus-37.svg',
    colors = ARRAY['#f5f5f5', '#1a1a2e', '#e94560'],
    category = 'new-arrivals',
    description = 'The latest Pegasus with responsive ZoomX foam for an energized ride.'
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE public.products SET
    name = 'Ultraboost Light',
    price = 190,
    original_price = NULL,
    rating = 5,
    image = '/images/products/Maroon.svg',
    colors = ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'],
    category = 'new-arrivals',
    description = '30% lighter than previous Ultraboost. Maximum energy return.'
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE public.products SET
    name = 'Fresh Foam X 1080v13',
    price = 165,
    original_price = NULL,
    rating = 4.5,
    image = '/images/products/air-max-90-flyease.svg',
    colors = ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'],
    category = 'new-arrivals',
    description = 'Plush comfort meets responsive performance. Your everyday essential.'
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE public.products SET
    name = 'Gel-Kayano 30',
    price = 140,
    original_price = 180,
    rating = 4,
    image = '/images/products/cosmic-unity.svg',
    colors = ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'],
    category = 'new-arrivals',
    description = '30th anniversary edition with enhanced stability technology.'
WHERE id = '00000000-0000-0000-0000-000000000004';

-- Row 2: Blue, Green, Red, White

UPDATE public.products SET
    name = 'Cloud X 4',
    price = 150,
    original_price = NULL,
    rating = 5,
    image = '/images/products/air-max-90-flyease.svg',
    colors = ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'],
    category = 'new-arrivals',
    description = 'Versatile training shoe for gym sessions and short runs.'
WHERE id = '00000000-0000-0000-0000-000000000005';

UPDATE public.products SET
    name = 'Novablast 4',
    price = 115,
    original_price = 140,
    rating = 4.5,
    image = '/images/products/cosmic-unity.svg',
    colors = ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'],
    category = 'new-arrivals',
    description = 'Bouncy FF Blast+ cushioning for a fun, energetic ride.'
WHERE id = '00000000-0000-0000-0000-000000000006';

UPDATE public.products SET
    name = 'Pegasus Trail 4',
    price = 145,
    original_price = NULL,
    rating = 4.5,
    image = '/images/products/Maroon.svg',
    colors = ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'],
    category = 'new-arrivals',
    description = 'Trail-ready traction with road-shoe comfort. Go anywhere.'
WHERE id = '00000000-0000-0000-0000-000000000007';

UPDATE public.products SET
    name = 'Glycerin 21',
    price = 130,
    original_price = 160,
    rating = 5,
    image = '/images/products/air-zoom-pegasus-37.svg',
    colors = ARRAY['#f5f5f5', '#1a1a2e', '#e94560'],
    category = 'new-arrivals',
    description = 'DNA LOFT v3 cushioning delivers a soft, smooth ride.'
WHERE id = '00000000-0000-0000-0000-000000000008';

-- TRENDING (Products 9-16)
-- Different image order: Green, White, Red, Blue, Red, Blue, White, Green

UPDATE public.products SET
    name = 'Air Max 90',
    price = 130,
    original_price = NULL,
    rating = 5,
    image = '/images/products/cosmic-unity.svg',
    colors = ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'],
    category = 'trending',
    description = 'The icon returns. Visible Air cushioning since 1990.'
WHERE id = '00000000-0000-0000-0000-000000000009';

UPDATE public.products SET
    name = '574 Core',
    price = 90,
    original_price = NULL,
    rating = 4.5,
    image = '/images/products/air-zoom-pegasus-37.svg',
    colors = ARRAY['#f5f5f5', '#1a1a2e'],
    category = 'trending',
    description = 'Classic heritage style meets modern comfort. An icon.'
WHERE id = '00000000-0000-0000-0000-000000000010';

UPDATE public.products SET
    name = 'Cloudmonster',
    price = 170,
    original_price = NULL,
    rating = 5,
    image = '/images/products/Maroon.svg',
    colors = ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'],
    category = 'trending',
    description = 'Maximum cushioning, monster energy return. Go big.'
WHERE id = '00000000-0000-0000-0000-000000000011';

UPDATE public.products SET
    name = 'Gel-Nimbus 25',
    price = 135,
    original_price = 160,
    rating = 4.5,
    image = '/images/products/air-max-90-flyease.svg',
    colors = ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'],
    category = 'trending',
    description = 'Pure comfort for long-distance runners. A best-seller.'
WHERE id = '00000000-0000-0000-0000-000000000012';

UPDATE public.products SET
    name = 'Vaporfly 3',
    price = 250,
    original_price = NULL,
    rating = 5,
    image = '/images/products/Maroon.svg',
    colors = ARRAY['#c41e3a', '#f5f5f5', '#1a1a2e'],
    category = 'trending',
    description = 'The record-breaking racing shoe. Elite performance.'
WHERE id = '00000000-0000-0000-0000-000000000013';

UPDATE public.products SET
    name = 'Saucony Kinvara 14',
    price = 120,
    original_price = NULL,
    rating = 4.5,
    image = '/images/products/air-max-90-flyease.svg',
    colors = ARRAY['#4169e1', '#2e8b57', '#f5f5f5'],
    category = 'trending',
    description = 'Lightweight and fast. Perfect for tempo runs.'
WHERE id = '00000000-0000-0000-0000-000000000014';

UPDATE public.products SET
    name = 'Ghost 15',
    price = 110,
    original_price = 140,
    rating = 5,
    image = '/images/products/air-zoom-pegasus-37.svg',
    colors = ARRAY['#f5f5f5', '#1a1a2e', '#4169e1'],
    category = 'trending',
    description = 'Smooth transitions, soft cushioning. A runner favorite.'
WHERE id = '00000000-0000-0000-0000-000000000015';

UPDATE public.products SET
    name = 'Hoka Bondi 8',
    price = 165,
    original_price = NULL,
    rating = 5,
    image = '/images/products/cosmic-unity.svg',
    colors = ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'],
    category = 'trending',
    description = 'Ultra-cushioned comfort for all-day wear. Fan favorite.'
WHERE id = '00000000-0000-0000-0000-000000000016';
