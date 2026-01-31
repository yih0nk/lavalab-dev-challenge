-- Reviews table for product reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = user_id);

-- Create index for faster product lookups
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Insert mock review data for all products
-- Product 1
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Sarah M.', 5, 'Best running shoes ever!', 'These shoes are incredibly comfortable. I''ve been running for 10 years and these are by far the best I''ve owned. The cushioning is perfect and they look great too!', true, 24, NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000001', 'Mike T.', 5, 'Perfect fit', 'Ordered my usual size and they fit perfectly. Very lightweight and breathable. Highly recommend for daily runs.', true, 18, NOW() - INTERVAL '12 days'),
('00000000-0000-0000-0000-000000000001', 'Jessica L.', 4, 'Great shoes, minor issue', 'Love the comfort and style. Only giving 4 stars because the laces are a bit short, but otherwise perfect!', true, 7, NOW() - INTERVAL '20 days'),
('00000000-0000-0000-0000-000000000001', 'David R.', 5, 'Worth every penny', 'I was hesitant about the price but these shoes are absolutely worth it. My feet feel great even after long runs.', false, 12, NOW() - INTERVAL '30 days');

-- Product 2
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000002', 'Emma W.', 5, 'Amazing quality!', 'The build quality is exceptional. These feel premium and perform even better. Love the red colorway!', true, 31, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-0000-000000000002', 'Chris B.', 4, 'Very comfortable', 'Super comfy for all-day wear. I use them for both gym sessions and casual outings.', true, 15, NOW() - INTERVAL '8 days'),
('00000000-0000-0000-0000-000000000002', 'Amanda K.', 5, 'Love these!', 'Second pair I''ve bought. They last forever and still feel like new after months of use.', true, 22, NOW() - INTERVAL '15 days');

-- Product 3
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000003', 'Ryan P.', 5, 'Best for long runs', 'Completed my first marathon in these. The cushioning held up great and no blisters!', true, 45, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000003', 'Nicole S.', 4, 'Good but runs small', 'Great shoes overall but I''d recommend going half size up. Once I exchanged, they were perfect.', true, 28, NOW() - INTERVAL '10 days'),
('00000000-0000-0000-0000-000000000003', 'Tom H.', 5, 'Excellent support', 'As someone with flat feet, finding supportive shoes is hard. These are a game-changer!', true, 19, NOW() - INTERVAL '25 days');

-- Product 4
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000004', 'Lisa G.', 4, 'Great deal on sale', 'Got these on discount and they''re fantastic. Comfortable and stylish green color.', true, 14, NOW() - INTERVAL '4 days'),
('00000000-0000-0000-0000-000000000004', 'James M.', 5, 'Exceeded expectations', 'Wasn''t sure about buying online but these exceeded all my expectations. True to size.', true, 21, NOW() - INTERVAL '18 days'),
('00000000-0000-0000-0000-000000000004', 'Karen L.', 4, 'Solid choice', 'Very good shoes for the price. The anniversary edition details are a nice touch.', false, 8, NOW() - INTERVAL '35 days');

-- Product 5
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000005', 'Alex D.', 5, 'Perfect for gym', 'These are now my go-to gym shoes. Great stability for lifting and comfortable for cardio.', true, 33, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000005', 'Michelle R.', 5, 'Versatile and stylish', 'Love that I can wear these for workouts and casual outings. The blue looks amazing!', true, 26, NOW() - INTERVAL '7 days'),
('00000000-0000-0000-0000-000000000005', 'Brian K.', 4, 'Great training shoe', 'Perfect for cross-training. Only wish they came in more colors.', true, 11, NOW() - INTERVAL '22 days');

-- Product 6
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000006', 'Stephanie H.', 5, 'So bouncy!', 'The cushioning on these is incredible. Every step feels like bouncing on clouds.', true, 29, NOW() - INTERVAL '6 days'),
('00000000-0000-0000-0000-000000000006', 'Mark J.', 4, 'Fun to run in', 'Really enjoyable ride. Makes running feel less like a chore and more like fun.', true, 17, NOW() - INTERVAL '14 days');

-- Product 7
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000007', 'Jennifer C.', 5, 'Trail beast', 'Took these on rocky trails and they handled everything. Great traction and comfort.', true, 38, NOW() - INTERVAL '9 days'),
('00000000-0000-0000-0000-000000000007', 'Steve W.', 4, 'Good for mixed terrain', 'Works well on both trails and pavement. Very versatile shoe.', true, 20, NOW() - INTERVAL '28 days'),
('00000000-0000-0000-0000-000000000007', 'Paula N.', 5, 'Love the grip', 'The outsole grip is phenomenal. No slipping even on wet rocks!', true, 25, NOW() - INTERVAL '40 days');

-- Product 8
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000008', 'Kevin O.', 5, 'Cloud-like comfort', 'The softest shoes I''ve ever worn. Perfect for recovery runs.', true, 42, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-0000-000000000008', 'Rachel T.', 5, 'Daily driver', 'These are my everyday shoes now. So comfortable I forget I''m wearing them.', true, 35, NOW() - INTERVAL '11 days'),
('00000000-0000-0000-0000-000000000008', 'Dan F.', 4, 'Great cushioning', 'Very plush and comfortable. Slightly heavy but the comfort is worth it.', true, 16, NOW() - INTERVAL '24 days');

-- Product 9 (Trending - Air Max 90)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000009', 'Tyler A.', 5, 'Classic never dies', 'The Air Max 90 is a timeless classic. Comfortable and stylish as always.', true, 156, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000009', 'Megan P.', 5, 'Icon status', 'Everyone needs a pair of these. The visible Air unit is iconic.', true, 98, NOW() - INTERVAL '8 days'),
('00000000-0000-0000-0000-000000000009', 'John D.', 5, 'Best sneaker ever made', 'Been wearing Air Max 90s for 20 years. This green colorway is fire!', true, 87, NOW() - INTERVAL '16 days'),
('00000000-0000-0000-0000-000000000009', 'Ashley M.', 4, 'Love the style', 'Great looking shoe. Takes a few days to break in but then perfect.', true, 45, NOW() - INTERVAL '30 days');

-- Product 10 (574 Core)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000010', 'Lauren B.', 5, 'Everyday essential', 'These go with everything. Most versatile sneakers I own.', true, 234, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000010', 'Greg S.', 5, 'Comfortable all day', 'Wear these to work and they''re comfortable even after 8+ hours on my feet.', true, 178, NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000010', 'Maria L.', 4, 'Classic style', 'Love the retro look. Wish they had more arch support but still great.', true, 67, NOW() - INTERVAL '19 days'),
('00000000-0000-0000-0000-000000000010', 'Peter K.', 5, 'Can''t go wrong', 'My 4th pair of 574s. They never disappoint.', true, 89, NOW() - INTERVAL '45 days');

-- Product 11 (Cloudmonster)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000011', 'Hannah R.', 5, 'Monster cushioning!', 'The name doesn''t lie. These have incredible cushioning for long runs.', true, 112, NOW() - INTERVAL '4 days'),
('00000000-0000-0000-0000-000000000011', 'Scott M.', 5, 'Game changer', 'My knees thank me every run. Best investment for joint health.', true, 95, NOW() - INTERVAL '12 days'),
('00000000-0000-0000-0000-000000000011', 'Diana W.', 5, 'Worth the hype', 'Saw these everywhere on social media and they live up to the hype!', true, 78, NOW() - INTERVAL '21 days');

-- Product 12 (Gel-Nimbus 25)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000012', 'Robert C.', 5, 'Marathon ready', 'Trained for and completed a marathon in these. Highly recommend!', true, 145, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-0000-000000000012', 'Emily F.', 4, 'Great long distance shoe', 'Perfect for anything over 10 miles. Very cushioned and supportive.', true, 88, NOW() - INTERVAL '15 days'),
('00000000-0000-0000-0000-000000000012', 'William T.', 5, 'Best Nimbus yet', 'I''ve had every version of the Nimbus. The 25 is the best one yet.', true, 67, NOW() - INTERVAL '33 days');

-- Product 13 (Vaporfly 3)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000013', 'Jason H.', 5, 'PR machine', 'Set a new personal record by 3 minutes wearing these. Worth every penny!', true, 189, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000013', 'Samantha K.', 5, 'Elite performance', 'If you''re serious about racing, these are a must. Incredible energy return.', true, 156, NOW() - INTERVAL '9 days'),
('00000000-0000-0000-0000-000000000013', 'Andrew L.', 5, 'Race day essential', 'Only use these for races but they make a noticeable difference.', true, 98, NOW() - INTERVAL '18 days');

-- Product 14 (Kinvara 14)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000014', 'Christina M.', 5, 'Fast and light', 'Perfect for tempo runs. So lightweight you forget you''re wearing them.', true, 134, NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000014', 'Patrick D.', 4, 'Great speed shoe', 'Excellent for faster runs. Not enough cushion for very long distances though.', true, 78, NOW() - INTERVAL '17 days'),
('00000000-0000-0000-0000-000000000014', 'Susan B.', 5, 'Love the fit', 'Fits like a glove. Very responsive and comfortable.', true, 56, NOW() - INTERVAL '29 days');

-- Product 15 (Ghost 15)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000015', 'Matthew R.', 5, 'Smooth operator', 'The transitions are so smooth. Best daily trainer I''ve owned.', true, 267, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000015', 'Linda H.', 5, 'Runner''s favorite', 'There''s a reason this is a best seller. Just works perfectly.', true, 198, NOW() - INTERVAL '6 days'),
('00000000-0000-0000-0000-000000000015', 'George N.', 5, 'Can''t beat it', 'On my 3rd pair. They wear out but I just keep buying more because they''re that good.', true, 145, NOW() - INTERVAL '14 days'),
('00000000-0000-0000-0000-000000000015', 'Nancy O.', 4, 'Very reliable', 'Consistent performance run after run. A trustworthy choice.', true, 89, NOW() - INTERVAL '26 days');

-- Product 16 (Hoka Bondi 8)
INSERT INTO public.reviews (product_id, author_name, rating, title, content, verified_purchase, helpful_count, created_at) VALUES
('00000000-0000-0000-0000-000000000016', 'Victoria S.', 5, 'Walking on clouds', 'The most cushioned shoe I''ve ever worn. Perfect for all-day comfort.', true, 234, NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000016', 'Charles E.', 5, 'Joint saver', 'As someone with bad knees, these are a lifesaver. So much cushion!', true, 189, NOW() - INTERVAL '7 days'),
('00000000-0000-0000-0000-000000000016', 'Dorothy P.', 5, 'All day comfort', 'Wear these for my retail job. My feet never hurt anymore.', true, 156, NOW() - INTERVAL '13 days'),
('00000000-0000-0000-0000-000000000016', 'Frank W.', 4, 'Great cushioning, bit bulky', 'Love the comfort but they are quite chunky. Still worth it though.', true, 78, NOW() - INTERVAL '25 days');
