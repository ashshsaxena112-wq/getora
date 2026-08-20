-- ==============================================================================
-- GETORA — COMPLETE PRODUCTION SUPABASE DATABASE ARCHITECTURE
-- Roles: Customer, Retailer, Delivery Partner, Admin
-- Supabase Auth (auth.users) is the Single Source of Truth for Identity
-- ==============================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. UTILITY FUNCTIONS & AUTOMATIC TRIGGERS
-- ==============================================================================

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic Order Number generation function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'GET-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 2. SAFE SCHEMA RESTRUCTURING
-- ==============================================================================
DROP TABLE IF EXISTS public.admin_audit_logs CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.customer_favorites CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.delivery_earnings CASCADE;
DROP TABLE IF EXISTS public.retailer_earnings CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.delivery_locations CASCADE;
DROP TABLE IF EXISTS public.delivery_tracking CASCADE;
DROP TABLE IF EXISTS public.tracking_events CASCADE;
DROP TABLE IF EXISTS public.delivery_partner_documents CASCADE;
DROP TABLE IF EXISTS public.delivery_partners CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.carts CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.retailer_documents CASCADE;
DROP TABLE IF EXISTS public.retailers CASCADE;
DROP TABLE IF EXISTS public.shops CASCADE;
DROP TABLE IF EXISTS public.stores CASCADE;
DROP TABLE IF EXISTS public.customer_addresses CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ==============================================================================
-- 3. CORE GETORA TABLES
-- ==============================================================================

-- 1. CUSTOMERS
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    profile_image_url TEXT,
    date_of_birth DATE,
    gender TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    current_address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CUSTOMER ADDRESSES
CREATE TABLE public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    address_type TEXT DEFAULT 'Home',
    full_name TEXT,
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    landmark TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RETAILERS
CREATE TABLE public.retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    owner_name TEXT,
    phone TEXT,
    email TEXT,
    profile_image_url TEXT,
    shop_name TEXT NOT NULL,
    shop_logo_url TEXT,
    shop_image_url TEXT,
    business_category TEXT,
    description TEXT,
    gst_number TEXT,
    pan_number TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    landmark TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    opening_time TIME,
    closing_time TIME,
    is_open BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RETAILER DOCUMENTS (Private Compliance Files)
CREATE TABLE public.retailer_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL REFERENCES public.retailers(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_number TEXT,
    document_url TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CATEGORIES
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5.1 MASTER PRODUCTS CATALOG (GETORA Pre-built Master Catalog)
CREATE TABLE public.master_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    suggested_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    suggested_selling_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    unit TEXT DEFAULT '1 pc',
    pack_info TEXT,
    image_url TEXT NOT NULL,
    sku TEXT UNIQUE,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5.2 PRODUCT REQUESTS (Retailers requesting new items to be added to Master Catalog)
CREATE TABLE public.product_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL REFERENCES public.retailers(id) ON DELETE CASCADE,
    retailer_name TEXT,
    name TEXT NOT NULL,
    brand TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    expected_price NUMERIC(12,2),
    unit TEXT DEFAULT '1 pc',
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PRODUCTS (Retailer Specific Inventory / Shop Listings)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL REFERENCES public.retailers(id) ON DELETE CASCADE,
    master_product_id TEXT REFERENCES public.master_products(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    sku TEXT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    selling_price NUMERIC(12,2) NOT NULL CHECK (selling_price >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    unit TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PRODUCT IMAGES (Multi-image catalog)
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    image_url TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. DELIVERY PARTNERS
CREATE TABLE public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    profile_image_url TEXT,
    date_of_birth DATE,
    gender TEXT,
    vehicle_type TEXT,
    vehicle_number TEXT,
    driving_license_number TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_online BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. DELIVERY PARTNER DOCUMENTS (Private Verification Files)
CREATE TABLE public.delivery_partner_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_partner_id UUID NOT NULL REFERENCES public.delivery_partners(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_number TEXT,
    document_url TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. CARTS
CREATE TABLE public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES public.retailers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. CART ITEMS
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

-- 12. ORDERS
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    retailer_id UUID NOT NULL REFERENCES public.retailers(id),
    delivery_partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE SET NULL,
    address_id UUID NOT NULL REFERENCES public.customer_addresses(id),
    subtotal NUMERIC(12,2) DEFAULT 0 CHECK (subtotal >= 0),
    delivery_fee NUMERIC(12,2) DEFAULT 0 CHECK (delivery_fee >= 0),
    discount NUMERIC(12,2) DEFAULT 0 CHECK (discount >= 0),
    tax NUMERIC(12,2) DEFAULT 0 CHECK (tax >= 0),
    total_amount NUMERIC(12,2) DEFAULT 0 CHECK (total_amount >= 0),
    payment_method TEXT DEFAULT 'COD',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT DEFAULT 'placed' CHECK (order_status IN (
        'placed',
        'accepted',
        'preparing',
        'ready_for_pickup',
        'picked_up',
        'out_for_delivery',
        'delivered',
        'cancelled'
    )),
    placed_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. ORDER ITEMS (Historical product snapshot for immutable records)
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. DELIVERY LOCATIONS (Realtime GPS tracking logs)
CREATE TABLE public.delivery_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    delivery_partner_id UUID NOT NULL REFERENCES public.delivery_partners(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. REVIEWS
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES public.retailers(id) ON DELETE SET NULL,
    delivery_partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. FAVORITES
CREATE TABLE public.customer_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES public.retailers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_customer_favorite UNIQUE (customer_id, product_id, retailer_id)
);

-- 17. NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    type TEXT,
    is_read BOOLEAN DEFAULT false,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================

-- Users / Entities
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_retailers_user_id ON public.retailers(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_user_id ON public.delivery_partners(user_id);

-- Customer Addresses
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON public.customer_addresses(customer_id);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_retailer_id ON public.products(retailer_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);

-- Product Images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- Carts
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_retailer_id ON public.orders(retailer_id);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_partner_id ON public.orders(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Delivery Tracking
CREATE INDEX IF NOT EXISTS idx_delivery_locations_order_id ON public.delivery_locations(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_locations_partner_id ON public.delivery_locations(delivery_partner_id);

-- Notifications & Reviews
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_retailer_id ON public.reviews(retailer_id);

-- ==============================================================================
-- 5. AUTOMATIC TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Trigger updated_at on all mutable tables
CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_retailers_updated_at BEFORE UPDATE ON public.retailers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_retailer_documents_updated_at BEFORE UPDATE ON public.retailer_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_delivery_partners_updated_at BEFORE UPDATE ON public.delivery_partners FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_delivery_partner_documents_updated_at BEFORE UPDATE ON public.delivery_partner_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic order number generation trigger
CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Automatic entity creation from auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT := 'customer';
BEGIN
    IF NEW.raw_user_meta_data->>'role' IN ('customer', 'retailer', 'delivery_partner') THEN
        user_role := NEW.raw_user_meta_data->>'role';
    END IF;

    IF user_role = 'retailer' THEN
        INSERT INTO public.retailers (
            user_id,
            owner_name,
            phone,
            email,
            shop_name,
            profile_image_url
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.phone,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'shop_name', 'My Shop'),
            NEW.raw_user_meta_data->>'avatar_url'
        ) ON CONFLICT (user_id) DO NOTHING;
    ELSIF user_role = 'delivery_partner' THEN
        INSERT INTO public.delivery_partners (
            user_id,
            full_name,
            phone,
            email,
            profile_image_url
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.phone,
            NEW.email,
            NEW.raw_user_meta_data->>'avatar_url'
        ) ON CONFLICT (user_id) DO NOTHING;
    ELSE
        INSERT INTO public.customers (
            user_id,
            full_name,
            phone,
            email,
            profile_image_url
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.phone,
            NEW.email,
            NEW.raw_user_meta_data->>'avatar_url'
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 17 tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partner_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- CUSTOMERS & ADDRESSES
-- ------------------------------------------------------------------------------
CREATE POLICY "Customers can view own profile"
    ON public.customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can update own profile"
    ON public.customers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own profile"
    ON public.customers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can manage own addresses"
    ON public.customer_addresses FOR ALL
    USING (EXISTS (SELECT 1 FROM public.customers WHERE customers.id = customer_addresses.customer_id AND customers.user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- RETAILERS & DOCUMENTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view active retailers"
    ON public.retailers FOR SELECT
    USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Retailers can update own profile"
    ON public.retailers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Retailers can insert own profile"
    ON public.retailers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Retailers can manage own documents"
    ON public.retailer_documents FOR ALL
    USING (EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = retailer_documents.retailer_id AND retailers.user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

-- ------------------------------------------------------------------------------
-- PRODUCTS & PRODUCT IMAGES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT
    USING (
        is_active = true 
        OR EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = products.retailer_id AND retailers.user_id = auth.uid())
    );

CREATE POLICY "Retailers can manage own products"
    ON public.products FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = products.retailer_id AND retailers.user_id = auth.uid())
    );

CREATE POLICY "Anyone can view product images"
    ON public.product_images FOR SELECT
    USING (true);

CREATE POLICY "Retailers can manage product images"
    ON public.product_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            JOIN public.retailers ON retailers.id = products.retailer_id
            WHERE products.id = product_images.product_id AND retailers.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- DELIVERY PARTNERS & DOCUMENTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view verified active delivery partners"
    ON public.delivery_partners FOR SELECT
    USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Delivery partner can update own profile"
    ON public.delivery_partners FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Delivery partner can insert own profile"
    ON public.delivery_partners FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delivery partner can manage own documents"
    ON public.delivery_partner_documents FOR ALL
    USING (EXISTS (SELECT 1 FROM public.delivery_partners WHERE delivery_partners.id = delivery_partner_documents.delivery_partner_id AND delivery_partners.user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- CARTS & CART ITEMS
-- ------------------------------------------------------------------------------
CREATE POLICY "Customers can manage own cart"
    ON public.carts FOR ALL
    USING (EXISTS (SELECT 1 FROM public.customers WHERE customers.id = carts.customer_id AND customers.user_id = auth.uid()));

CREATE POLICY "Customers can manage own cart items"
    ON public.cart_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.carts
            JOIN public.customers ON customers.id = carts.customer_id
            WHERE carts.id = cart_items.cart_id AND customers.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view relevant orders"
    ON public.orders FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.customers WHERE customers.id = orders.customer_id AND customers.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = orders.retailer_id AND retailers.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.delivery_partners WHERE delivery_partners.id = orders.delivery_partner_id AND delivery_partners.user_id = auth.uid())
    );

CREATE POLICY "Customers can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.customers WHERE customers.id = orders.customer_id AND customers.user_id = auth.uid())
    );

CREATE POLICY "Authorized parties can update orders"
    ON public.orders FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM public.customers WHERE customers.id = orders.customer_id AND customers.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = orders.retailer_id AND retailers.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.delivery_partners WHERE delivery_partners.id = orders.delivery_partner_id AND delivery_partners.user_id = auth.uid())
    );

CREATE POLICY "Users can view relevant order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (
                EXISTS (SELECT 1 FROM public.customers WHERE customers.id = orders.customer_id AND customers.user_id = auth.uid())
                OR EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = orders.retailer_id AND retailers.user_id = auth.uid())
                OR EXISTS (SELECT 1 FROM public.delivery_partners WHERE delivery_partners.id = orders.delivery_partner_id AND delivery_partners.user_id = auth.uid())
            )
        )
    );

CREATE POLICY "Customers can create order items during order placement"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            JOIN public.customers ON customers.id = orders.customer_id
            WHERE orders.id = order_items.order_id AND customers.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- LIVE DELIVERY TRACKING (GPS)
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view delivery locations for their orders"
    ON public.delivery_locations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = delivery_locations.order_id
            AND (
                EXISTS (SELECT 1 FROM public.customers WHERE customers.id = orders.customer_id AND customers.user_id = auth.uid())
                OR EXISTS (SELECT 1 FROM public.retailers WHERE retailers.id = orders.retailer_id AND retailers.user_id = auth.uid())
                OR EXISTS (SELECT 1 FROM public.delivery_partners WHERE delivery_partners.id = orders.delivery_partner_id AND delivery_partners.user_id = auth.uid())
            )
        )
    );

CREATE POLICY "Assigned delivery partners can log GPS coordinates"
    ON public.delivery_locations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.delivery_partners
            WHERE delivery_partners.id = delivery_locations.delivery_partner_id AND delivery_partners.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- REVIEWS & FAVORITES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Customers can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.customers WHERE customers.id = reviews.customer_id AND customers.user_id = auth.uid())
    );

CREATE POLICY "Customers can update/delete own reviews"
    ON public.reviews FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM public.customers WHERE customers.id = reviews.customer_id AND customers.user_id = auth.uid())
    );

CREATE POLICY "Customers can manage own favorites"
    ON public.customer_favorites FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.customers WHERE customers.id = customer_favorites.customer_id AND customers.user_id = auth.uid())
    );

-- ------------------------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. SUPABASE REALTIME CONFIGURATION
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.orders; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_locations; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications; EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ==============================================================================
-- 8. SUPABASE STORAGE BUCKETS & STORAGE POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('customer-images', 'customer-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
    ('retailer-images', 'retailer-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
    ('shop-images', 'shop-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
    ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
    ('delivery-partner-images', 'delivery-partner-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
    ('delivery-documents', 'delivery-documents', false, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read Access for Public Buckets" ON storage.objects;
    DROP POLICY IF EXISTS "Delivery Documents Access Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Customer Images Upload Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Customer Images Update Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Customer Images Delete Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Retailer Images Upload Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Retailer Images Update Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Retailer Images Delete Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Product Images Upload Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Product Images Update Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Product Images Delete Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Delivery Partner Images Upload Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Delivery Partner Images Update Policy" ON storage.objects;
    DROP POLICY IF EXISTS "Delivery Partner Images Delete Policy" ON storage.objects;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE POLICY "Public Read Access for Public Buckets"
ON storage.objects FOR SELECT
USING (
    bucket_id IN (
        'customer-images', 
        'retailer-images', 
        'shop-images', 
        'product-images', 
        'delivery-partner-images'
    )
);

CREATE POLICY "Delivery Documents Access Policy"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'delivery-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Customer Images Upload Policy"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'customer-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Customer Images Update Policy"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'customer-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Customer Images Delete Policy"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'customer-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Retailer Images Upload Policy"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id IN ('retailer-images', 'shop-images')
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Retailer Images Update Policy"
ON storage.objects FOR UPDATE
USING (
    bucket_id IN ('retailer-images', 'shop-images')
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Retailer Images Delete Policy"
ON storage.objects FOR DELETE
USING (
    bucket_id IN ('retailer-images', 'shop-images')
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Product Images Upload Policy"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Product Images Update Policy"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Product Images Delete Policy"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Delivery Partner Images Upload Policy"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id IN ('delivery-partner-images', 'delivery-documents')
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Delivery Partner Images Update Policy"
ON storage.objects FOR UPDATE
USING (
    bucket_id IN ('delivery-partner-images', 'delivery-documents')
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Delivery Partner Images Delete Policy"
ON storage.objects FOR DELETE
USING (
    bucket_id IN ('delivery-partner-images', 'delivery-documents')
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==============================================================================
-- 9. SAFE INITIAL CATEGORIES SEED
-- ==============================================================================
INSERT INTO public.categories (name, description, image_url, is_active, sort_order)
VALUES
    ('Hardware', 'Tools, building supplies, fasteners, plumbing, and DIY essentials', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80', true, 1),
    ('Electrical', 'Wires, switches, LED lighting, appliances, cables and electronics', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80', true, 2),
    ('Mobile Accessories', 'Fast chargers, cases, powerbanks, earphones, and screen guards', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80', true, 3),
    ('Stationery', 'Notebooks, pens, office supplies, art materials, and school items', 'https://images.unsplash.com/photo-1456735190829-80ab072ac1a0?w=600&auto=format&fit=crop&q=80', true, 4),
    ('Home Essentials', 'Cleaning, home care, kitchenware, storage, and utility essentials', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80', true, 5),
    ('Auto Accessories', 'Car care, bike cleaners, phone mounts, helmets, and vehicle utilities', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80', true, 6),
    ('Pet Products', 'Pet food, treats, toys, grooming supplies, and accessories', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80', true, 7)
ON CONFLICT (name) DO NOTHING;

-- Backfill profile for existing auth.users (e.g. ashshsaxena11@gmail.com) into customers
INSERT INTO public.customers (user_id, full_name, phone, email, is_active, is_verified)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)), 
    phone, 
    email, 
    true, 
    true
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
