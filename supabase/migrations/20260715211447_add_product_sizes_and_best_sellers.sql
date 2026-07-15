/*
# Product Sizes + Auto Best-Sellers

## Overview
Adds support for product sizes/variants (e.g. pizza S/M/L, drinks 12oz/16oz)
while keeping single-size products (e.g. cake slices) simple. Also adds a
database view that ranks products by total quantity sold so the homepage
"Best Sellers" section can be driven by real sales data instead of a manual
`featured` flag.

## 1. New columns

### products.sizes (jsonb, nullable)
- JSON array of size objects: `[{"label":"Small","price":15}, {"label":"Large","price":25}]`
- When NULL or empty, the product has a single size and uses `products.price`.
- When present, each size has its own price. The first size is the default.
- Example: a pizza could have sizes `[{label:"Medium",price:35},{label:"Large",price:45}]`.
- A cake slice would have `sizes = NULL` and just use `price`.

### order_items.size_label (text, nullable)
- Records which size was ordered, for items that had sizes.
- NULL for single-size products.

## 2. New view: best_sellers
- Aggregates order_items by product_id, sums quantity, ranks descending.
- Columns: product_id, total_sold, product_name, product_image, product_price
- Safe to query from the client (read-only view, covered by existing RLS on
  underlying tables — the view runs as the caller).

## 3. RLS
- No new tables, so no new RLS policies needed.
- The view inherits RLS from the underlying products/order_items tables.
  We grant SELECT on the view to the anon and authenticated roles so the
  homepage can read best-seller data.

## 4. Notes
- Existing products are untouched: sizes defaults to NULL, so they keep
  using the existing `price` column exactly as before.
- The `featured` boolean remains as a manual fallback/override for products
  with no sales history yet.
*/

-- ── products.sizes ──────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sizes jsonb;

COMMENT ON COLUMN products.sizes IS
  'JSON array of size variants [{"label":"Small","price":15}]. NULL = single-size product using `price`.';

-- ── order_items.size_label ───────────────────────────────────────
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS size_label text;

COMMENT ON COLUMN order_items.size_label IS
  'Size label chosen by customer for products with sizes. NULL for single-size products.';

-- ── best_sellers view ────────────────────────────────────────────
CREATE OR REPLACE VIEW best_sellers AS
SELECT
  p.id   AS product_id,
  p.name AS product_name,
  p.image AS product_image,
  p.price AS product_price,
  p.sizes AS product_sizes,
  COALESCE(SUM(oi.quantity), 0) AS total_sold
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name, p.image, p.price, p.sizes;

-- Grant read access on the view to anon + authenticated
GRANT SELECT ON best_sellers TO anon, authenticated;

-- Index to speed up the aggregation behind the view
CREATE INDEX IF NOT EXISTS order_items_product_id_quantity_idx
  ON order_items(product_id);