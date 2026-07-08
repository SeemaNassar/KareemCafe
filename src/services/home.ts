import { getSupabaseServerClient } from "../lib/supabase";
import type {
  GalleryImage,
  Offer,
  Product,
  SettingsSummary,
  SiteSettings,
  Category,
} from "../types";

/**
 * Server-side data services. Bulk, cached at the route level.
 * All queries are non-throwing and return typed results.
 */

export async function fetchSettings(): Promise<SettingsSummary | null> {
  const { data, error } = await getSupabaseServerClient()
    .from("site_settings")
    .select("about_title, about_body, about_image, hero_tagline")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return null;
  return data as SettingsSummary;
}

export async function fetchActiveOffers(): Promise<Offer[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("offers")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: false });
  if (error || !data) return [];
  return data as Offer[];
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("products")
    .select("*")
    .order("id", { ascending: false });
  if (error || !data) return [];
  return data as Product[];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("categories")
    .select("*")
    .order("id");
  if (error || !data) return [];
  return data as Category[];
}

export async function fetchAllOffers(): Promise<Offer[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("offers")
    .select("*")
    .order("id", { ascending: false });
  if (error || !data) return [];
  return data as Offer[];
}

export async function fetchAllGallery(): Promise<GalleryImage[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("gallery")
    .select("*")
    .order("id", { ascending: false });
  if (error || !data) return [];
  return data as GalleryImage[];
}

export async function fetchActiveGallery(): Promise<GalleryImage[]> {
  const { data, error } = await getSupabaseServerClient()
    .from("gallery")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: false });
  if (error || !data) return [];
  return data as GalleryImage[];
}

/**
 * Single-shot payload for the homepage. Returns settings, offers, products,
 * categories, and gallery so the server can stream everything in parallel.
 */
export type HomePayload = {
  settings: SettingsSummary | null;
  offers: Offer[];
  products: Product[];
  categories: Category[];
  gallery: GalleryImage[];
};

export async function fetchHomePayload(): Promise<HomePayload> {
  const [settings, offers, products, categories, gallery] =
    await Promise.all([
      fetchSettings(),
      fetchActiveOffers(),
      fetchProducts(),
      fetchCategories(),
      fetchActiveGallery(),
    ]);
  return { settings, offers, products, categories, gallery };
}

export type { SiteSettings };
