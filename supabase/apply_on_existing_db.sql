/*
# ملف موحّد لتحديث قاعدة البيانات الموجودة
#
# هذا الملف يفترض أن الجداول موجودة أصلاً (من المايجريشنز القديمة).
# يقوم بـ:
# 1. حذف كل السياسات (policies) القديمة
# 2. إنشاء سياسات آمنة جديدة (المدير فقط يكتب، الجميع يقرأ)
# 3. إنشاء دوال الإدارة
#
# طريقة الاستخدام: انسخ هذا الملف بالكامل والصقه في SQL Editor في Supabase واضغط Run
*/

-- ============================================================
-- 1. حذف كل السياسات القديمة من كل الجداول
-- ============================================================

-- categories
DROP POLICY IF EXISTS "categories_select" ON categories;
DROP POLICY IF EXISTS "categories_select_anon" ON categories;
DROP POLICY IF EXISTS "categories_insert" ON categories;
DROP POLICY IF EXISTS "categories_update" ON categories;
DROP POLICY IF EXISTS "categories_delete" ON categories;
DROP POLICY IF EXISTS "read_categories" ON categories;
DROP POLICY IF EXISTS "insert_categories" ON categories;
DROP POLICY IF EXISTS "update_categories" ON categories;
DROP POLICY IF EXISTS "delete_categories" ON categories;

-- products
DROP POLICY IF EXISTS "products_select" ON products;
DROP POLICY IF EXISTS "products_select_anon" ON products;
DROP POLICY IF EXISTS "products_insert" ON products;
DROP POLICY IF EXISTS "products_update" ON products;
DROP POLICY IF EXISTS "products_delete" ON products;
DROP POLICY IF EXISTS "read_products" ON products;
DROP POLICY IF EXISTS "insert_products" ON products;
DROP POLICY IF EXISTS "update_products" ON products;
DROP POLICY IF EXISTS "delete_products" ON products;

-- offers
DROP POLICY IF EXISTS "offers_select" ON offers;
DROP POLICY IF EXISTS "offers_select_anon" ON offers;
DROP POLICY IF EXISTS "offers_insert" ON offers;
DROP POLICY IF EXISTS "offers_update" ON offers;
DROP POLICY IF EXISTS "offers_delete" ON offers;
DROP POLICY IF EXISTS "read_offers" ON offers;
DROP POLICY IF EXISTS "insert_offers" ON offers;
DROP POLICY IF EXISTS "update_offers" ON offers;
DROP POLICY IF EXISTS "delete_offers" ON offers;

-- gallery
DROP POLICY IF EXISTS "gallery_select" ON gallery;
DROP POLICY IF EXISTS "gallery_select_anon" ON gallery;
DROP POLICY IF EXISTS "gallery_insert" ON gallery;
DROP POLICY IF EXISTS "gallery_update" ON gallery;
DROP POLICY IF EXISTS "gallery_delete" ON gallery;
DROP POLICY IF EXISTS "read_gallery" ON gallery;
DROP POLICY IF EXISTS "insert_gallery" ON gallery;
DROP POLICY IF EXISTS "update_gallery" ON gallery;
DROP POLICY IF EXISTS "delete_gallery" ON gallery;

-- site_settings
DROP POLICY IF EXISTS "settings_select" ON site_settings;
DROP POLICY IF EXISTS "settings_select_anon" ON site_settings;
DROP POLICY IF EXISTS "settings_update" ON site_settings;
DROP POLICY IF EXISTS "settings_insert" ON site_settings;
DROP POLICY IF EXISTS "read_settings" ON site_settings;
DROP POLICY IF EXISTS "insert_settings" ON site_settings;
DROP POLICY IF EXISTS "update_settings" ON site_settings;
DROP POLICY IF EXISTS "delete_settings" ON site_settings;

-- orders
DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "orders_insert_anon" ON orders;
DROP POLICY IF EXISTS "orders_insert_auth" ON orders;
DROP POLICY IF EXISTS "orders_delete" ON orders;
DROP POLICY IF EXISTS "insert_orders" ON orders;
DROP POLICY IF EXISTS "read_orders" ON orders;
DROP POLICY IF EXISTS "update_orders" ON orders;
DROP POLICY IF EXISTS "delete_orders" ON orders;

-- order_items
DROP POLICY IF EXISTS "order_items_select" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_anon" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_auth" ON order_items;
DROP POLICY IF EXISTS "order_items_delete" ON order_items;
DROP POLICY IF EXISTS "insert_order_items" ON order_items;
DROP POLICY IF EXISTS "read_order_items" ON order_items;
DROP POLICY IF EXISTS "update_order_items" ON order_items;
DROP POLICY IF EXISTS "delete_order_items" ON order_items;

-- ============================================================
-- 2. دالة التحقق من صلاحيات المدير
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
-- 3. سياسات جديدة آمنة
-- ============================================================

-- categories: القراءة للجميع، الكتابة للمدير فقط
CREATE POLICY "read_categories" ON categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "update_categories" ON categories
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_categories" ON categories
  FOR DELETE TO authenticated USING (public.is_admin());

-- products: القراءة للجميع، الكتابة للمدير فقط
CREATE POLICY "read_products" ON products
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_products" ON products
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "update_products" ON products
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_products" ON products
  FOR DELETE TO authenticated USING (public.is_admin());

-- offers: القراءة للجميع، الكتابة للمدير فقط
CREATE POLICY "read_offers" ON offers
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_offers" ON offers
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "update_offers" ON offers
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_offers" ON offers
  FOR DELETE TO authenticated USING (public.is_admin());

-- gallery: القراءة للجميع، الكتابة للمدير فقط
CREATE POLICY "read_gallery" ON gallery
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_gallery" ON gallery
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "update_gallery" ON gallery
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_gallery" ON gallery
  FOR DELETE TO authenticated USING (public.is_admin());

-- site_settings: القراءة للجميع، الكتابة للمدير فقط
CREATE POLICY "read_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_settings" ON site_settings
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "update_settings" ON site_settings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_settings" ON site_settings
  FOR DELETE TO authenticated USING (public.is_admin());

-- orders: الإضافة للجميع، الإدارة للمدير فقط
CREATE POLICY "insert_orders" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "read_orders" ON orders
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "update_orders" ON orders
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_orders" ON orders
  FOR DELETE TO authenticated USING (public.is_admin());

-- order_items: الإضافة للجميع، الإدارة للمدير فقط
CREATE POLICY "insert_order_items" ON order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "read_order_items" ON order_items
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "update_order_items" ON order_items
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "delete_order_items" ON order_items
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 4. دوال الإدارة
-- ============================================================
CREATE OR REPLACE FUNCTION public.promote_to_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'::jsonb
  )
  WHERE email = admin_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', admin_email;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.demote_from_admin(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data - 'role'
  WHERE email = admin_email;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.promote_to_admin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.demote_from_admin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ============================================================
-- 5. فهارس إضافية
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(active);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(active);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
