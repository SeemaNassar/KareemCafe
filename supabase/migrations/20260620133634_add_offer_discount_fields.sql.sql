-- Extend offers table to support quantity-based discount rules ("2 Mojitos for 30₪").
-- product_id references the product the offer applies to.
-- required_quantity is how many units trigger the offer (e.g. 2).
-- discounted_price is the flat price charged per offer bundle when the
--   required_quantity is met. When the cart quantity exceeds a multiple of
--   required_quantity, each full bundle is charged at discounted_price and
--   any remainder is charged at the product's normal unit price.
-- All new columns are nullable so purely-display offers (image-only banners)
-- remain supported and existing rows are untouched.

ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS required_quantity INT CHECK (required_quantity IS NULL OR required_quantity > 1),
  ADD COLUMN IF NOT EXISTS discounted_price NUMERIC(10,2) CHECK (discounted_price IS NULL OR discounted_price >= 0);

CREATE INDEX IF NOT EXISTS offers_product_active_idx
  ON offers(product_id) WHERE active = true AND product_id IS NOT NULL;

COMMENT ON COLUMN offers.product_id IS 'Product this offer applies to. NULL for display-only offers.';
COMMENT ON COLUMN offers.required_quantity IS 'Units required to trigger the offer (must be > 1).';
COMMENT ON COLUMN offers.discounted_price IS 'Flat price charged per offer bundle when required_quantity is met.';
