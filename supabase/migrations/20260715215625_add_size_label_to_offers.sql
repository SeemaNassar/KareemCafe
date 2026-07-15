/*
# Add size_label to offers

## Overview
Allows a quantity-based offer to target a specific size of a product.
Previously offers could only target a product as a whole, which was
ambiguous for products with multiple sizes (e.g. a pizza with S/M/L).
Now the admin can say "2 Large Pizzas for 80₪" specifically.

## 1. New column

### offers.size_label (text, nullable)
- The size label the offer applies to (must match a label in the
  product's `sizes` JSON array).
- NULL means the offer applies to the product's base/only size —
  i.e. products without sizes, or a catch-all for any size.

## 2. RLS
- No new tables; no new policies needed.

## 3. Notes
- Existing offers are untouched (size_label defaults to NULL).
- The discount engine will match an offer to a cart line only when
  both product_id AND size_label match (NULL matches NULL).
*/

ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS size_label text;

COMMENT ON COLUMN offers.size_label IS
  'Size label the offer applies to. NULL = base/only size or any size for products without sizes.';