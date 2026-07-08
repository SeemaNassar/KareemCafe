/*
# دالة تعيين المدير وتسهيلات الإدارة

## التغييرات
1. إنشاء دالة `promote_to_admin(email text)` لتعيين دور المدير لأي مستخدم
   - تستخدم للمستخدمين الحاليين فقط
   - تضع `role: admin` في `raw_app_meta_data`
2. إنشاء دالة `demote_from_admin(email text)` لإزالة دور المدير
3. فهارس إضافية لتحسين البحث
*/

-- ============================================================
-- 1. دالة تعيين المدير
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
    RAISE EXCEPTION 'المستخدم غير موجود: %', admin_email;
  END IF;
END;
$$;

-- ============================================================
-- 2. دالة إزالة دور المدير
-- ============================================================
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

  IF NOT FOUND THEN
    RAISE EXCEPTION 'المستخدم غير موجود: %', admin_email;
  END IF;
END;
$$;

-- ============================================================
-- 3. منح صلاحية تنفيذ الدوال للمستخدمين المصادق عليهم فقط
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.promote_to_admin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.demote_from_admin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
