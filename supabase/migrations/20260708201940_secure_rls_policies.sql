/*
# تحسين سياسات الأمان (RLS) لجميع الجداول

## المشكلة
السياسات الحالية تستخدم `USING (true)` لجميع عمليات الكتابة،
مما يعني أن أي مستخدم مسجل دخول يمكنه تعديل وحذف جميع البيانات.

## التغييرات
1. إنشاء دالة `is_admin()` للتحقق من صلاحيات المدير
   - تتحقق من `raw_app_meta_data->>'role' = 'admin'` في JWT
2. سياسات جديدة لكل جدول:
   - **products, categories, offers, gallery, site_settings**:
     - القراءة: متاحة للجميع (anon + authenticated)
     - الكتابة (إضافة/تعديل/حذف): للمدير فقط
   - **orders, order_items**:
     - الإضافة: متاحة للجميع (لإرسال الطلبات)
     - القراءة/التعديل/الحذف: للمدير فقط
3. إضافة فهارس لتحسين الأداء
*/

-- ============================================================
-- 1. دالة التحقق من صلاحيات المدير
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'raw_app_meta_data' ->> 'role') = 'admin',
    false
  );
$$;

-- ============================================================
-- 2. سياسات products
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_products" ON public.products;
CREATE POLICY "read_products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_products" ON public.products;
CREATE POLICY "insert_products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_products" ON public.products;
CREATE POLICY "update_products" ON public.products
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_products" ON public.products;
CREATE POLICY "delete_products" ON public.products
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 3. سياسات categories
-- ============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON public.categories;
CREATE POLICY "read_categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_categories" ON public.categories;
CREATE POLICY "insert_categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_categories" ON public.categories;
CREATE POLICY "update_categories" ON public.categories
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_categories" ON public.categories;
CREATE POLICY "delete_categories" ON public.categories
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 4. سياسات offers
-- ============================================================
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_offers" ON public.offers;
CREATE POLICY "read_offers" ON public.offers
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_offers" ON public.offers;
CREATE POLICY "insert_offers" ON public.offers
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_offers" ON public.offers;
CREATE POLICY "update_offers" ON public.offers
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_offers" ON public.offers;
CREATE POLICY "delete_offers" ON public.offers
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 5. سياسات gallery
-- ============================================================
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_gallery" ON public.gallery;
CREATE POLICY "read_gallery" ON public.gallery
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_gallery" ON public.gallery;
CREATE POLICY "insert_gallery" ON public.gallery
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_gallery" ON public.gallery;
CREATE POLICY "update_gallery" ON public.gallery
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_gallery" ON public.gallery;
CREATE POLICY "delete_gallery" ON public.gallery
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 6. سياسات site_settings
-- ============================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_settings" ON public.site_settings;
CREATE POLICY "read_settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_settings" ON public.site_settings;
CREATE POLICY "insert_settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_settings" ON public.site_settings;
CREATE POLICY "update_settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_settings" ON public.site_settings;
CREATE POLICY "delete_settings" ON public.site_settings
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 7. سياسات orders — الإضافة متاحة للجميع، الإدارة للمدير فقط
-- ============================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_orders" ON public.orders;
CREATE POLICY "insert_orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_orders" ON public.orders;
CREATE POLICY "read_orders" ON public.orders
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "update_orders" ON public.orders;
CREATE POLICY "update_orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_orders" ON public.orders;
CREATE POLICY "delete_orders" ON public.orders
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 8. سياسات order_items
-- ============================================================
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_order_items" ON public.order_items;
CREATE POLICY "insert_order_items" ON public.order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_order_items" ON public.order_items;
CREATE POLICY "read_order_items" ON public.order_items
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "update_order_items" ON public.order_items;
CREATE POLICY "update_order_items" ON public.order_items
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_order_items" ON public.order_items;
CREATE POLICY "delete_order_items" ON public.order_items
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 9. فهارس لتحسين الأداء
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_offers_active ON public.offers(active);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON public.gallery(active);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_created_at ON public.order_items(created_at DESC);
