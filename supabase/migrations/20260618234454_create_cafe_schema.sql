-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "categories_select_anon" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "categories_insert" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_update" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "categories_delete" ON categories FOR DELETE TO authenticated USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  image text,
  featured boolean NOT NULL DEFAULT false,
  category_id bigint REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "products_select_anon" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "products_delete" ON products FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);

-- Offers
CREATE TABLE IF NOT EXISTS offers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_select" ON offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "offers_select_anon" ON offers FOR SELECT TO anon USING (true);
CREATE POLICY "offers_insert" ON offers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "offers_update" ON offers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "offers_delete" ON offers FOR DELETE TO authenticated USING (true);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  image text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_select" ON gallery FOR SELECT TO authenticated USING (true);
CREATE POLICY "gallery_select_anon" ON gallery FOR SELECT TO anon USING (true);
CREATE POLICY "gallery_insert" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "gallery_update" ON gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "gallery_delete" ON gallery FOR DELETE TO authenticated USING (true);

-- Site settings (About Us content, hero text, etc.) - single row
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  about_title text NOT NULL DEFAULT 'Our Story',
  about_body text NOT NULL DEFAULT '',
  about_image text,
  hero_tagline text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

INSERT INTO site_settings (id, about_title, about_body, about_image, hero_tagline)
VALUES (1, 'Crafted with Passion', 'Born from a love for specialty coffee and warm conversations, Cafe Kareem is a sanctuary where every cup tells a story. From hand-selected beans to our signature desserts and fresh mojitos, we craft moments worth savoring.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24', 'Premium Coffee • Desserts • Mojitos')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select" ON site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings_select_anon" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "settings_update" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "settings_insert" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);

-- Seed categories if empty
INSERT INTO categories (name)
SELECT * FROM (VALUES ('Coffee'), ('Desserts'), ('Mojitos'), ('Food')) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM categories);