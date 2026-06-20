export type Category = {
  id: number;
  name: string;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  featured: boolean | null;
  category_id: number | null;
  created_at: string;
};

export type Offer = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  active: boolean;
  created_at: string;
  product_id: number | null;
  required_quantity: number | null;
  discounted_price: number | null;
};

export type GalleryImage = {
  id: number;
  image: string;
  active: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  about_title: string | null;
  about_body: string | null;
  about_image: string | null;
  hero_tagline: string | null;
};

export type ProductSummary = Pick<
  Product,
  "id" | "name" | "description" | "price" | "image" | "featured" | "category_id"
>;

export type SettingsSummary = Pick<
  SiteSettings,
  "about_title" | "about_body" | "about_image" | "hero_tagline"
>;

export type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type QueryResult<T> = { data: T | null; error: Error | null };
