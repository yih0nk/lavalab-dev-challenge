-- SHOPALL Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional user data
-- ===========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- PRODUCTS TABLE
-- Store product information
-- ===========================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  images TEXT[],
  colors TEXT[] NOT NULL,
  sizes INTEGER[],
  category TEXT NOT NULL,
  description TEXT,
  details TEXT[],
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- CART ITEMS TABLE
-- Store user shopping cart items
-- ===========================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_color TEXT NOT NULL,
  selected_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, selected_color, selected_size)
);

-- ===========================================
-- WISHLIST ITEMS TABLE
-- Store individual wishlist items
-- ===========================================
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ===========================================
-- WISHLISTS TABLE
-- Store wishlists with shareable tokens
-- ===========================================
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_public BOOLEAN DEFAULT FALSE,
  title TEXT DEFAULT 'My Wishlist',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a trigger to automatically create a wishlist when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_wishlist()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wishlists (user_id, title)
  VALUES (NEW.id, 'My Wishlist');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_wishlist
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_wishlist();

-- ===========================================
-- ORDERS TABLE
-- Store order information
-- ===========================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- ORDER ITEMS TABLE
-- Store individual order line items
-- ===========================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_snapshot JSONB NOT NULL,
  quantity INTEGER NOT NULL,
  selected_color TEXT NOT NULL,
  selected_size INTEGER,
  price_at_purchase DECIMAL(10,2) NOT NULL
);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Products policies (public read access)
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

-- Cart policies
CREATE POLICY "Users can view own cart"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlist items policies
CREATE POLICY "Users can view own wishlist items"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own wishlist"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlists policies
CREATE POLICY "Users can manage own wishlists"
  ON public.wishlists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public wishlists"
  ON public.wishlists FOR SELECT
  USING (is_public = true);

-- Public wishlist items view (for shared wishlists)
CREATE POLICY "Anyone can view items in public wishlists"
  ON public.wishlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.user_id = wishlist_items.user_id
      AND wishlists.is_public = true
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for own orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ===========================================
-- ENABLE REALTIME
-- For real-time stock updates
-- ===========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- ===========================================
-- SEED DATA (Optional - matches existing products.ts)
-- ===========================================
INSERT INTO public.products (id, name, price, original_price, rating, review_count, image, colors, sizes, category, description, details, stock) VALUES
  ('00000000-0000-0000-0000-000000000001', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/air-zoom-pegasus-37.png', ARRAY['#f5f5f5', '#1a1a2e', '#e94560'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Premium athletic footwear with cutting-edge technology and sleek design.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000002', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/Maroon.png', ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Engineered for speed and comfort, delivering exceptional performance.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000003', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/air-max-90-flyease.png', ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Next-level cushioning technology for those who push boundaries.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000004', 'HAVIT HV-G92 Gamepad', 960, 1160, 4, 75, '/images/products/cosmic-unity.png', ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Premium comfort meets bold design. Now available at a special price.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 15),
  ('00000000-0000-0000-0000-000000000005', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/air-max-90-flyease.png', ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Clean aesthetics with powerful performance.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000006', 'HAVIT HV-G92 Gamepad', 960, 1160, 4, 75, '/images/products/cosmic-unity.png', ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Bold green colorway with trusted performance technology.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 8),
  ('00000000-0000-0000-0000-000000000007', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/Maroon.png', ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Sleek red design for bold excellence.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000008', 'HAVIT HV-G92 Gamepad', 960, 1160, 4, 75, '/images/products/air-zoom-pegasus-37.png', ARRAY['#f5f5f5', '#1a1a2e', '#e94560'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'new-arrivals', 'Classic white edition with enhanced breathability. Limited time offer.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 5),
  ('00000000-0000-0000-0000-000000000009', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/air-zoom-pegasus-37.png', ARRAY['#f5f5f5', '#1a1a2e'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'A fan favorite that continues to dominate. Clean design, proven performance.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000010', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/Maroon.png', ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'Bold red meets everyday comfort. A trending choice.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000011', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/air-max-90-flyease.png', ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'The blue edition everyone is talking about. Perfect 5-star rated.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000012', 'HAVIT HV-G92 Gamepad', 960, 1160, 4, 75, '/images/products/cosmic-unity.png', ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'Green vibes at a special price. Trending for good reason.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 3),
  ('00000000-0000-0000-0000-000000000013', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/air-max-90-flyease.png', ARRAY['#4169e1', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'The iconic blue design that started it all. A timeless favorite.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000014', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/cosmic-unity.png', ARRAY['#2e8b57', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'Bold green colorway for those who dare to stand out.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000015', 'HAVIT HV-G92 Gamepad', 160, NULL, 5, 88, '/images/products/Maroon.png', ARRAY['#c41e3a', '#1a1a2e', '#f5f5f5'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'Clean red base with striking accents. Perfect 5-star comfort.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 100),
  ('00000000-0000-0000-0000-000000000016', 'HAVIT HV-G92 Gamepad', 960, 1160, 4, 75, '/images/products/air-zoom-pegasus-37.png', ARRAY['#f5f5f5', '#1a1a2e', '#e94560'], ARRAY[6, 7, 8, 9, 10, 11, 12], 'trending', 'Classic white meets cool performance. Now on sale.', ARRAY['Breathable mesh upper for enhanced ventilation', 'GEL technology cushioning for superior comfort', 'Durable rubber outsole with excellent grip', 'Removable sockliner for custom orthotics', 'Reflective details for low-light visibility'], 12);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to decrement stock when an order is placed
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(stock - p_quantity, 0)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for faster lookups
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_wishlists_share_token ON public.wishlists(share_token);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to decrement product stock
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
