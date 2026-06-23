-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  customer_address text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  order_type text NOT NULL DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "orders_insert_anon" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "orders_insert_auth" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE TO authenticated USING (true);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id bigint REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  line_total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "order_items_insert_anon" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "order_items_insert_auth" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "order_items_delete" ON order_items FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);